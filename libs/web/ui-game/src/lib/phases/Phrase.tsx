import { GameContext } from '@hypnos/web/network';
import {
  ActionIcon,
  Affix,
  Button,
  Center,
  CheckIcon,
  Container,
  Drawer,
  Grid,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDrawCards, useNextPlayerSID } from './hooks';

import { GiCardPick } from 'react-icons/gi';
import { CardDrawer, PlayerList } from 'libs/web/ui-game-controls/src';
import { XNickname } from '@hypnos/web/ui-design-system';
import { Card } from 'libs/web/ui-game-controls/src/lib/Card';
import { ActionType, GameEntity } from 'libs/web/network/src/lib/types';
import { useNextPhase } from '../Hooks';
import { PhrasePhaseEvents } from '@hypnos/shared/gameevents';
import { Socket } from 'socket.io';

export interface SubmitPayload {
  phrase: string;
  cardUrl: string;
}

export const PhrasePhase = () => {
  const [mounted, setMounted] = useState(false);
  const context = useContext(GameContext);
  const draw = useDrawCards();
  const nextSID = useNextPlayerSID();
  const nextPhase = useNextPhase();

  const [cardsOpened, setCardsOpened] = useState(false);
  const [card, setCard] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);

  const init = useCallback(() => {
    if (!context) return;

    const [state, dispatch] = context;

    if (state.me.player.isMaster) {
      draw();
    }
  }, [context, draw]);

  useEffect(() => {
    if (!mounted) {
      init();
      setMounted(true);
    }
  }, [init, mounted]);

  const handleCardChange = (src: string) => {
    setCard(src);
  };

  const notifySubmit = () => {
    if (!context) return;

    const [state] = context;

    (state.me.socket as Socket).emit(PhrasePhaseEvents.submit, state.roomCode, {
      phrase: prompt,
      cardUrl: card,
    } as SubmitPayload);
  };

  const handleSubmit = (data: SubmitPayload) => {
    if (!context) return;

    const [state, dispatch] = context;

    if (!state.me.player.isMaster) return;

    dispatch({
      type: ActionType.setGame,
      payload: {
        ...state,
        round: {
          ...state.round,
          realCardUrl: data.cardUrl,
          phrase: data.phrase,
          playerData: [
            {
              playerSID: state.round?.currentPlayerSID,
              ownedCardUrl: data.cardUrl,
            },
          ],
          roundPhase: nextPhase(),
        },
      } as GameEntity,
    });
  };

  useEffect(() => {
    if (!context) return;

    const [state] = context;
    const socket = state.me.socket as Socket;

    socket.on(PhrasePhaseEvents.submit, handleSubmit);

    return () => {
      socket.off(PhrasePhaseEvents.submit, handleSubmit);
    };
  }, []);

  return (
    <>
      <CardDrawer
        opened={cardsOpened}
        setOpened={setCardsOpened}
        mode="select"
        onChange={handleCardChange}
        value={card}
      />
      <Grid>
        <Grid.Col span={2}>
          <PlayerList
            players={
              context?.[0].players.map((p, key) => ({
                name: p.name ?? '???',
                highlight: p.socketId === context[0].me.player.socketId,
                state:
                  p.socketId === context[0].round?.currentPlayerSID
                    ? 'notready'
                    : 'none',
              })) ?? []
            }
          />
        </Grid.Col>

        <Grid.Col span={10}>
          <Center sx={{ height: 'calc(100vh - 24px)' }}>
            {context &&
            context[0].me.socket.id === context[0].round?.currentPlayerSID ? (
              <Stack justify="center" align="center">
                <Text>Chose card from drawer and enter a prompt: </Text>
                <TextInput
                  autoComplete="off"
                  onChange={(e) => setPrompt(e.target.value)}
                />
                {card && <Card src={card} />}
                <Button disabled={!prompt || !card} onClick={notifySubmit}>
                  Submit
                </Button>
              </Stack>
            ) : (
              context && (
                <Stack justify="center" align="center">
                  <Text>{`Waiting for ${
                    context?.[0].players.find(
                      (p) => p.socketId === context[0].round?.currentPlayerSID
                    )?.name
                  } to choose card and prompt`}</Text>
                  <Loader size="lg" />
                </Stack>
              )
            )}
          </Center>
        </Grid.Col>
      </Grid>
    </>
  );
};
