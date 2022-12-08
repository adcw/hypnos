import { GameContext } from '@hypnos/web/network';
import {
  Button,
  Center,
  Grid,
  Loader,
  Navbar,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDrawCards, useNextPlayerSID } from './hooks';

import { PhrasePhaseEvents } from '@hypnos/shared/gameevents';
import { useEvent } from 'libs/web/network/src/lib/hooks';
import {
  ActionType,
  PlayerEntity,
  RoundEntity,
} from 'libs/web/network/src/lib/types';
import {
  CardDrawer,
  GameProgress,
  PlayerList,
} from 'libs/web/ui-game-controls/src';
import { Card } from 'libs/web/ui-game-controls/src/lib/Card';
import { Socket } from 'socket.io';
import { useNextPhase } from '../Hooks';
import { sx } from 'libs/web/ui-design-system/src/lib/buttonSX';

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

    const [state] = context;

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

  const handleSubmit = useCallback(
    (data: SubmitPayload) => {
      if (!context) return;

      const [state, dispatch] = context;

      if (!state.me.player.isMaster) return;

      console.log('State: ', state);

      console.log('Room code  is ' + state.roomCode);

      dispatch({
        type: ActionType.setGame,
        payload: {
          ...state,
          players: state.players.map((p) =>
            p.socketId === state.round?.currentPlayerSID
              ? ({
                  ...p,
                  cards: p.cards.filter((c) => c !== data.cardUrl),
                } as PlayerEntity)
              : p
          ),
          round: {
            ...state.round,
            phrase: data.phrase,
            playerData: [
              {
                playerSID: state.round?.currentPlayerSID,
                ownedCardUrl: data.cardUrl,
              },
            ],
            roundPhase: nextPhase(),
          } as RoundEntity,
        },
      });
    },
    [context?.[0]]
  );

  useEvent(PhrasePhaseEvents.submit, handleSubmit);

  return (
    <>
      {/* <GameProgress maxValue={30} data={context?.[0].players ?? []} /> */}
      <CardDrawer
        opened={cardsOpened}
        setOpened={setCardsOpened}
        mode={
          context &&
          context[0].me.socket.id === context[0].round?.currentPlayerSID
            ? 'select'
            : 'view'
        }
        onChange={handleCardChange}
        value={card}
      />
      <PlayerList
        maxValue={30}
        data={
          context?.[0].players.map((p, key) => ({
            player: p,
            highlight: p.socketId === context[0].me.player.socketId,
            state:
              p.socketId === context[0].round?.currentPlayerSID
                ? 'notready'
                : 'none',
          })) ?? []
        }
      />
      <Center sx={{ height: '100vh' }}>
        {context &&
        context[0].me.socket.id === context[0].round?.currentPlayerSID ? (
          <Stack justify="center" align="center" spacing={6}>
            <Text>Chose card from drawer and enter a prompt: </Text>
            <TextInput
              autoComplete="off"
              onChange={(e) => setPrompt(e.target.value)}
            />
            {card && <Card src={card} />}
            <Button sx={sx} disabled={!prompt || !card} onClick={notifySubmit}>
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
    </>
  );
};
