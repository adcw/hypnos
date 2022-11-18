import { io, Socket } from 'socket.io-client';

import { MantineProvider, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainMenu } from '@hypnos/web/ui-mainmenu';
import { GameProvider } from '@hypnos/web/network';
import { Lobby } from '@hypnos/web/ui-lobby';
import { Game } from '@hypnos/web/ui-game';
import { themeOverride } from '@hypnos/web/ui-design-system';
import { Room } from '@hypnos/web/ui-room';

const socket = io(
  // window.location.hostname + ':3301'
  process.env['NODE_ENV'] === 'development'
    ? window.location.hostname + ':3301'
    : window.location.hostname + '/socket.io'
);

export function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <MantineProvider theme={themeOverride}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameProvider mySocket={socket} />}>
            <Route path="/" element={<MainMenu />} />
            <Route path="/game" element={<Room />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
