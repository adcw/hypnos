import { color, XNickname } from '@hypnos/web/ui-design-system';
import {
  Box,
  CheckIcon,
  Container,
  Group,
  Loader,
  Navbar,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { PlayerEntity } from 'libs/web/network/src/lib/types';

export interface PlayerListProps {
  data: {
    player: PlayerEntity;
    state: PlayerState;
    highlight: boolean;
  }[];
  maxValue: number;
}

export type PlayerState = 'notready' | 'ready' | 'none';

export const PlayerList = (props: PlayerListProps) => {
  const labelCount = 11;
  return (
    <Navbar height={12} fixed sx={{ top: '0px', width: '100vw' }} zIndex={200}>
      <Stack spacing={0} sx={{ width: 'auto' }} m="md">
        <Group spacing={0} position="apart">
          <Box sx={{ width: '140px' }} />
          <Group sx={{ width: 'calc(100% - 140px)' }} position="apart">
            {Array(labelCount)
              .fill(0)
              .map((_, i) => {
                return (
                  <Text key={i} size="xs" color="dimmed">
                    {Math.floor((i * props.maxValue) / (labelCount - 1))}
                  </Text>
                );
              })}
          </Group>
        </Group>
        {props.data.map((d, k) => (
          <Group align="center" key={k}>
            <Group sx={{ width: '120px' }} position="apart">
              <Text color={d.player.color} size="xs">
                {d.player.name}
              </Text>
              {d.state === 'ready' && (
                <Box sx={{ color: 'green' }}>
                  <CheckIcon height={20} width={20} fillOpacity={1} />
                </Box>
              )}
              {d.state === 'notready' && <Loader variant="dots" size="xs" />}
            </Group>

            <Box sx={{ width: 'calc(100% - 175px)' }}>
              <Tooltip
                label={d.player.points ?? 0}
                events={{ hover: true, focus: true, touch: true }}
                position="right"
              >
                <Box
                  sx={{
                    background: d.player.color,
                    width: '10px',
                    height: '10px',
                    borderRadius: '12px',

                    position: 'relative',
                    left: `${((d.player.points ?? 0) / props.maxValue) * 100}%`,
                    transition: '0.4s',
                  }}
                />
              </Tooltip>
            </Box>
          </Group>
        ))}
      </Stack>
    </Navbar>
  );
};
