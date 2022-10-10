import { ForgeryPhaseEvents } from '@hypnos/shared/gameevents';
import { GameContext } from '@hypnos/web/network';
import { CardDrawer, PlayerList, Card } from '@hypnos/web/ui-game-controls';
import { Button, Center, Grid, Stack, Text } from '@mantine/core';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io';

export const Forgery = () => {
  const context = useContext(GameContext);

  const [cardsOpened, setCardsOpened] = useState(false);
  const [card, setCard] = useState<string | null>(null);

  const handleCardChange = (src: string) => {
    setCard(src);
  };

  const notifySubmit = () => {
    if (!context) return;

    const [state] = context;

    console.log('Emmiting');

    (state.me.socket as Socket).emit(
      ForgeryPhaseEvents.submit,
      state.roomCode,
      card
    );
  };

  const handleSubmit = (card: string) => {
    console.log('New card is ', card);

    // if (!context) return;

    // const [state, dispatch] = context;

    // if (!state.me.player.isMaster) return;

    // console.log('State: ', state);

    // dispatch({
    //   type: ActionType.setGame,
    //   payload: {
    //     ...state,
    //     players: state.players.map((p) =>
    //       p.socketId === state.round?.currentPlayerSID
    //         ? ({
    //             ...p,
    //             cards: p.cards.filter((c) => c !== data.cardUrl),
    //           } as PlayerEntity)
    //         : p
    //     ),
    //     round: {
    //       ...state.round,
    //       phrase: data.phrase,
    //       playerData: [
    //         {
    //           playerSID: state.round?.currentPlayerSID,
    //           ownedCardUrl: data.cardUrl,
    //         },
    //       ],
    //       roundPhase: nextPhase(),
    //     },
    //   } as GameEntity,
    // });

    // nextPhase();
  };

  useEffect(() => {
    if (!context) return;

    const [state] = context;
    const socket = state.me.socket as Socket;

    socket.on(ForgeryPhaseEvents.submit, handleSubmit);

    return () => {
      socket.off(ForgeryPhaseEvents.submit, handleSubmit);
    };
  }, [context?.[0]]);

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
                state: context[0].round?.playerData.find(
                  (pp) => pp.playerSID === p.socketId
                )
                  ? 'ready'
                  : 'notready',
              })) ?? []
            }
          />
        </Grid.Col>

        <Grid.Col span={10}>
          <Center sx={{ height: 'calc(100vh - 24px)' }}>
            <Stack justify="center" align="center">
              {context &&
              context[0].me.socket.id === context[0].round?.currentPlayerSID ? (
                <Text>{`Wait for other players to choose the most convincing card for your prompt`}</Text>
              ) : (
                <Stack justify="center" align="center">
                  <Text color="teal" size={26}>
                    {context?.[0].round?.phrase}
                  </Text>
                  <Text>Chose card from drawer and enter a prompt: </Text>

                  {card && <Card src={card} />}
                  <Button disabled={!prompt || !card} onClick={notifySubmit}>
                    Submit
                  </Button>
                </Stack>
              )}
            </Stack>
          </Center>
        </Grid.Col>
      </Grid>
    </>
  );
};
