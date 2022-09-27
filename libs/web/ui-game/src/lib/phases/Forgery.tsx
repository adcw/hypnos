import { GameContext } from '@hypnos/web/network';
import { CardDrawer, PlayerList } from '@hypnos/web/ui-game-controls';
import { Grid } from '@mantine/core';
import { useContext, useState } from 'react';

export const Forgery = () => {
  const context = useContext(GameContext);

  const [cardsOpened, setCardsOpened] = useState(false);
  const [card, setCard] = useState<string | null>(null);

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
                highlight: p.socketId === context[0].me.player.socketId,
                state:
                  p.socketId === context[0].round?.currentPlayerSID
                    ? 'notready'
                    : 'none',
              })) ?? []
            }
          />
        </Grid.Col>
      </Grid>
    </>
  );
};
