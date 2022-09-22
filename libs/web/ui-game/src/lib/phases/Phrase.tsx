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
import { useDrawCards } from './hooks';

import { GiCardPick } from 'react-icons/gi';
import { CardDrawer, PlayerList } from 'libs/web/ui-game-controls/src';
import { XNickname } from '@hypnos/web/ui-design-system';
import { Card } from 'libs/web/ui-game-controls/src/lib/Card';

export const PhrasePhase = () => {
  const [mounted, setMounted] = useState(false);
  const context = useContext(GameContext);
  const draw = useDrawCards();

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
                highlight: p.socketId === context[0].me.player.name,
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
                <Button disabled={!prompt || !card}>Submit</Button>
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
