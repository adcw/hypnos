import { Box, Group, Navbar, Stack, Text } from '@mantine/core';
import { PlayerEntity } from 'libs/web/network/src/lib/types';

export interface GameProgressProps {
  maxValue: number;
  data: PlayerEntity[];
}

export const GameProgress = (props: GameProgressProps) => {
  return (
    <Navbar height={12} m="xl">
      <Stack spacing="xs">
        {props.data.map((p) => (
          <Group align="center">
            <Text color={p.color} size="sm" sx={{ width: '100px' }}>
              {p.name}
            </Text>
            <Box
              sx={{
                background: p.color,
                width: '10px',
                height: '10px',
                borderRadius: '12px',

                position: 'relative',
                left: `${((p.points ?? 0) / props.maxValue) * 100}%`,
                transition: '0.4s',
              }}
            />
          </Group>
        ))}
      </Stack>
    </Navbar>
  );
};
