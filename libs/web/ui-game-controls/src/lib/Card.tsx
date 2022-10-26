import { useLongPress } from '@hypnos/web/ui-design-system';
import {
  Card as MCard,
  Image,
  Modal,
  Text,
  ContainerProps,
  Box,
  Overlay,
  SelectChevronIcon,
  CheckIcon,
  Center,
} from '@mantine/core';
// import { useLongPress } from 'libs/web/ui-game/src/lib/phases/hooks';

import { MouseEvent, useState } from 'react';

export interface CardProps {
  src: string;
  onHeld?: () => void;
  chosen?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  text?: string;
}

export const Card = (props: CardProps) => {
  const [fullscreen, setFullscreen] = useState(false);

  const handleHold = () => {
    setFullscreen(true);
    props.onHeld && props.onHeld();
  };

  const [onStart, onEnd] = useLongPress(handleHold, 200);

  return (
    <>
      <MCard
        onClick={() => {
          !props.disabled && props.onClick && props.onClick();
        }}
        p="xs"
        radius="md"
        sx={{
          width: 170,
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          transition: '0.3s',

          '&:hover': {
            transform: !props.disabled ? 'scale(1.02)' : undefined,
          },
        }}
      >
        <Box sx={{ height: 260, width: '100%' }}>
          {props.chosen && (
            <Box
              sx={{
                position: 'absolute',
                zIndex: 300,

                height: '80px',
                width: '80px',

                top: 'calc(50% - 40px)',
                left: 'calc(50% - 40px)',

                color: '#08962e',

                pointerEvents: 'none',
              }}
            >
              <CheckIcon />
            </Box>
          )}
          {props.disabled && (
            <Overlay sx={{ zIndex: 10 }} color="black" opacity={0.2} blur={1} />
          )}
          {props.text && (
            <Center
              style={{
                position: 'absolute',
                zIndex: 20,
                height: 'inherit',
                width: 150,
              }}
            >
              <Text
                color={'dimmed'}
                weight={600}
                size={15}
                px={10}
                style={{
                  backgroundColor: '#000000ab',
                  borderRadius: '20px',
                }}
              >
                {props.text}
              </Text>
            </Center>
          )}
          <Image
            onTouchStart={onStart}
            onTouchEnd={onEnd}
            onMouseDown={onStart}
            onMouseUp={onEnd}
            onClick={onEnd}
            src={props.src}
          />
        </Box>
      </MCard>

      <Modal
        opened={fullscreen}
        onClose={() => setFullscreen(false)}
        fullScreen
      >
        <Image src={props.src} />
      </Modal>
    </>
  );
};
