import { io } from 'socket.io-client';

import { Text } from '@mantine/core';
import { useEffect, useState } from 'react';

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
    <>
      <Text>Witaj</Text>

      {messages.map((message, key) => {
        return <Text key={key}>{message}</Text>;
      })}
    </>
  );
}

export default App;
