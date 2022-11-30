import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Socket } from 'socket.io';
import { GameContext } from './web-network';

export const useGameLeave = (
  onGameLeave: () => void,
  allowedLocations: string[]
) => {
  const location = useLocation();
  const path = (p: string) => {
    const begSlash = p.charAt(0) === '/';
    const endSlash = p.charAt(p.length - 1) === '/';

    const r = p.slice(begSlash ? 1 : 0, p.length - (endSlash ? 1 : 0));
    console.log(r);

    return r;
  };

  useEffect(() => {
    console.log(location.pathname.slice(1));

    if (!allowedLocations.includes(path(location.pathname))) {
      onGameLeave();
    }
  }, [location]);
};

export const useEvent = (
  eventName: string,
  callback: (...args: any) => void
) => {
  const context = useContext(GameContext);

  useEffect(() => {
    if (!context) return;

    const [state] = context;
    const socket = state.me.socket as Socket;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [context?.[0]]);
};
