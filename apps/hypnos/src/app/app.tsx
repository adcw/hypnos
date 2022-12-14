import { io, Socket, SocketOptions } from 'socket.io-client';

import { MantineProvider, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainMenu } from '@hypnos/web/ui-mainmenu';
import { Welcome } from '@hypnos/web/ui-welcome';
import { GameProvider } from '@hypnos/web/network';
import { Lobby } from '@hypnos/web/ui-lobby';
import { Game } from '@hypnos/web/ui-game';
import { themeOverride } from '@hypnos/web/ui-design-system';
import { Room } from '@hypnos/web/ui-room';

const isProduction = false;
const socket = isProduction ? io() : io(':3301');

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

  /**
   * <Route path="/" element={<GameProvider mySocket={socket} />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/menu" element={<MainMenu />} />
            <Route path="/game" element={<Room />} />
          </Route>
   */

  return (
    <MantineProvider theme={themeOverride}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/game" element={<GameProvider mySocket={socket} />}>
            <Route path="/game" element={<MainMenu />} />
            <Route path="/game/room" element={<Room />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
