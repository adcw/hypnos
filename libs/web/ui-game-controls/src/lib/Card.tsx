import { Card as MCard, Image, Modal } from '@mantine/core';
import { useLongPress } from 'libs/web/ui-game/src/lib/phases/hooks';
import { useState } from 'react';

export interface CardProps {
  src: string;
  onHeld?: () => void;
}

export const Card = (props: CardProps) => {
  const noAct = () => false;

  const [fullscreen, setFullscreen] = useState(false);

  const handleHold = () => {
    setFullscreen(true);
    props.onHeld && props.onHeld();
  };

  const [onStart, onEnd] = useLongPress(handleHold, 200);

  return (
    <>
      <MCard
        p="xs"
        radius="md"
        sx={{
          width: 170,
        }}
      >
        <Image
          onTouchStart={onStart}
          onTouchEnd={onEnd}
          onClick={onEnd}
          height={260}
          src={props.src}
        />
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
