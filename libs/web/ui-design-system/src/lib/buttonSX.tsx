import { Sx } from '@mantine/core';

export const sx: Sx = {
  textAlign: 'center' as const,
  color: '#FFEEB0',
  fontSize: '18px',
  background: '#241E1E',
  transition: 'text-shadow 0.3s',

  '&:enabled': {},
  '&:disabled': {
    color: '#3b3c3f',
    background: '#101113',
  },
  '&:active': {
    boxShadow: 'inset 0 0 10px #000',
    textShadow: '0 0 10px #FFEEB0',
    transform: 'scale(0.95)',
  },
  '&:hover': {
    background: '#101113',
    textShadow: '0 0 10px #FFEEB0',
  },
};
