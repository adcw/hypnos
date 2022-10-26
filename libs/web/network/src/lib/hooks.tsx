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

  useEffect(() => {
    if (!allowedLocations.includes(location.pathname.slice(1))) {
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
