import { GameContext } from '@hypnos/web/network';
import {
  Center,
  Grid,
  Group,
  Progress,
  Stack,
  Title,
  Text,
} from '@mantine/core';
import { useContext, useEffect, useMemo } from 'react';

export const GameOver = () => {
  const context = useContext(GameContext);

  const data = useMemo(() => {
    if (!context) return;

    return {
      max: context?.[0].players.reduce((max, curr) => {
        const points = curr.points ?? 0;
        return points > max ? points ?? 0 : max;
      }, 0),
    };
  }, [context]);

  return (
    <Grid m={0} p={0}>
      <Grid.Col m={0} p={0}>
        <Center sx={{ height: '100vh' }}>
          <Stack align="center">
            <Title
              order={2}
              variant="gradient"
              gradient={{ from: 'teal', to: 'blue' }}
            >
              Game Over!
            </Title>
            {context &&
              context[0].players.map((p, k) => {
                return (
                  <Group key={k} sx={{ width: '100%' }}>
                    <Group align="flex-start">
                      <Progress
                        label={`${p.points} ${
                          p.points === 1 ? 'point' : 'points'
                        }`}
                        radius="xs"
                        size="xl"
                        value={((p.points ?? 0) / (data?.max ?? 1)) * 100}
                        sx={{ width: '300px' }}
                      />
                    </Group>
                    <Text>{p.name}</Text>
                  </Group>
                );
              })}
          </Stack>
        </Center>
      </Grid.Col>
    </Grid>
  );
};
