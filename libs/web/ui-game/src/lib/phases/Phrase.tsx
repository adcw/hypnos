import { GameContext } from '@hypnos/web/network';
import {
  ActionIcon,
  Affix,
  Center,
  CheckIcon,
  Container,
  Drawer,
  Grid,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDrawCards } from './hooks';

import { GiCardPick } from 'react-icons/gi';
import { CardDrawer, PlayerList } from 'libs/web/ui-game-controls/src';
import { XNickname } from '@hypnos/web/ui-design-system';

export const PhrasePhase = () => {
  const [mounted, setMounted] = useState(false);
  const context = useContext(GameContext);
  const draw = useDrawCards();

  const [cardsOpened, setCardsOpened] = useState(false);

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

  return (
    <>
      <CardDrawer
        opened={cardsOpened}
        setOpened={setCardsOpened}
        mode="select"
      />
      <Grid>
        <Grid.Col span={2}>
          <PlayerList
            players={
              context?.[0].players.map((p, key) => ({
                name: p.name ?? '???',
                highlight: p.socketId === context[0].me.player.name,
                state: 'ready',
              })) ?? []
            }
          />
        </Grid.Col>

        <Grid.Col span={10}>
          <Center sx={{ height: '100vh' }}>
            <Text>AAA</Text>
          </Center>
        </Grid.Col>
      </Grid>
    </>
  );
};
