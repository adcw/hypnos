import { arrayShuffle } from '@hypnos/shared/constants';
import fs = require('fs');

export const EnvVars = {
  EXPRESS_PORT: 'EXPRESS_PORT',
  SOCKET_PORT: 'SOCKET_PORT',
  DOMAIN: 'DOMAIN',
  APP_PORT: 'APP_PORT',
};

export const getEnv = () => {
  const defaultValues: Record<keyof typeof EnvVars, string> = {
    EXPRESS_PORT: '3302',
    SOCKET_PORT: '3301',
    DOMAIN: 'http://localhost',
    APP_PORT: '80',
  };

  return Object.fromEntries(
    Object.values(EnvVars).map((envVar) => {
      const value = process.env[envVar];
      const defVal = defaultValues[envVar];
      if (!value) {
        console.log(
          `ENV WARNING: ${envVar} is not set! Using default value: ${defVal}`
        );
      }

      return [envVar, value ?? defVal];
    })
  );
};

export function readDir(path: string) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);
}

export const getRandomRoomCode = () =>
  [...Array(4)].map(() => Math.random().toString(36)[2].toUpperCase()).join('');
