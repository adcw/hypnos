import { Sx, UnstyledButton, UnstyledButtonProps } from '@mantine/core';
import { ReactNode } from 'react';

export interface GButtonProps extends UnstyledButtonProps {
  onClick(): void;
  width?: number;
}

export function GButton(props: GButtonProps) {
  const style: Sx = {
    width: `${props.width}px`,
    textAlign: 'center' as const,
    color: '#FFEEB0',
    fontSize: '18px',
    background: '#101113',
    padding: '10px 15px',
    borderRadius: '15px',
    transition: 'text-shadow 0.3s',

    '&:enabled': {},
    '&:disabled': {
      color: '#B7B88F',
      background: '#101113',
    },
    '&:active': {
      boxShadow: 'inset 0 0 10px #000000',
      transform: 'scale(0.95)',
    },
    '&:hover': {
      background: '#101113',
      textShadow: '0 0 10px #FFEEB0',
    },
  };

  return <UnstyledButton {...props} sx={style} />;
}

export default GButton;
