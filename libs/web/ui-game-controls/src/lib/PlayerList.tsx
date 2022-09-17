import { XNickname } from '@hypnos/web/ui-design-system';
import { Box, CheckIcon, Container, Group, Loader, Stack } from '@mantine/core';

export interface PlayerListProps {
  players: {
    name: string;
    state: 'notready' | 'ready' | 'none';
    highlight: boolean;
  }[];
}

export const PlayerList = (props: PlayerListProps) => {
  return (
    <Stack m={12} sx={{ width: '200px' }}>
      {props.players.map((p, key) => {
        return (
          <Group key={key} position="apart">
            <XNickname
              value={p.name}
              color="gray"
              size="lg"
              highlight={p.highlight}
            />
            {p.state === 'ready' && (
              <Box sx={{ color: 'green' }}>
                <CheckIcon height={20} width={20} fillOpacity={1} />
              </Box>
            )}
            {p.state === 'notready' && <Loader variant="dots" />}
          </Group>
        );
      })}
    </Stack>
  );
};
