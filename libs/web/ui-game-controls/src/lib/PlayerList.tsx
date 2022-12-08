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
  return (
    <Navbar height={12} m="xl">
      <Stack spacing="xs">
        {props.data.map((d, k) => (
          <Group align="center" key={k} sx={{ whiteSpace: 'nowrap' }}>
            <Text color={d.player.color} size="sm" sx={{ width: '100px' }}>
              {d.player.name}
            </Text>
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
          </Group>
        ))}
      </Stack>
    </Navbar>
    // <Stack m={12} sx={{ width: '170px' }} spacing="xs">
    //   {props.players.map((p, key) => {
    //     return (
    //       <Group key={key} position="apart">
    //         <XNickname
    //           value={p.name}
    //           color={p.color}
    //           size="sm"
    //           // highlight={p.highlight}
    //         />
    //         {p.state === 'ready' && (
    //           <Box sx={{ color: 'green' }}>
    //             <CheckIcon height={20} width={20} fillOpacity={1} />
    //           </Box>
    //         )}
    //         {p.state === 'notready' && <Loader variant="dots" size="sm" />}
    //       </Group>
    //     );
    //   })}
    // </Stack>
  );
};
