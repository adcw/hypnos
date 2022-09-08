import { io, Socket } from 'socket.io-client';

import { Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainMenu } from '@hypnos/web/ui-mainmenu';
import { GameProvider } from '@hypnos/web/network';
import { Lobby } from '@hypnos/web/ui-lobby';

const socket = io('http://localhost:3001');

export function App() {
  const [messages, setMessages] = useState<string[]>([]);

  const [isConnected, setIsConnected] = useState(socket.connected);

  const displayMessage = (message: string) => {
    setMessages([...messages, message]);
  };

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      displayMessage(`You connected with id: ${socket.id}`);
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameProvider mySocket={socket} />}>
          <Route path="/" element={<MainMenu />} />
          <Route path="/lobby" element={<Lobby />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
