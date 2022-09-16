import {
  Card as MCard,
  Image,
  Modal,
  ContainerProps,
  Box,
  Overlay,
  SelectChevronIcon,
  CheckIcon,
} from '@mantine/core';
import { useLongPress } from 'libs/web/ui-game/src/lib/phases/hooks';
import { MouseEvent, useState } from 'react';

export interface CardProps {
  src: string;
  onHeld?: () => void;
  chosen?: boolean;
  disabled?: boolean;
  onClick?: () => void;
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
        }}
      >
        <Box sx={{ height: 260 }}>
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
          {props.disabled && <Overlay color="black" opacity={0.2} blur={1} />}
          <Image
            onTouchStart={onStart}
            onTouchEnd={onEnd}
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
