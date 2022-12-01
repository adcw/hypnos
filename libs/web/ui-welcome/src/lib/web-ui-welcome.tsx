import styles from './web-ui-welcome.module.css';
import { List, Box, Modal, BackgroundImage, Center, Card, Group, Button, Image, Badge, Text, Paper, Container, Title, ThemeIcon } from '@mantine/core';
import image from "../lib/background.jpg";
import logo from "../lib/logo.png";
import { useState } from 'react';
import { IconCircleCheck } from '@tabler/icons';
import { useNavigate } from "react-router-dom";


/* eslint-disable-next-line */
export interface WebUiWelcomeProps { }

export function Welcome(props: WebUiWelcomeProps) {
  const [bcgOpened, setBcgOpened] = useState(true);
  const [opened, setOpened] = useState(false);

  const navigate = useNavigate();


  return (
    <Box mx="auto">
      <BackgroundImage
        src={image}
        radius="sm"
        style={{ width: '100vw', height: '100vh', filter: 'blur(6px)' }}
      >
        <Modal
          opened={bcgOpened}
          onClose={() => setBcgOpened(false)}
          closeOnClickOutside={false}
          sx={{
            '.mantine-Modal-close': {
              display: 'none'
            }
          }}
        >
          <Image src={logo}></Image>
          <Center>
            <Button
              onClick={() => navigate("/menu")}
            >PLAY GAME</Button>
          </Center>
          <Center style={{ marginTop: '50px', marginBottom: '50px' }}>
            <Button
              onClick={() => setOpened(true)}
            >GAME MANUAL</Button>
          </Center>

          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
          >
            <Center>
              <Title order={1}>Game Manual</Title>
            </Center>
            <List
              style={{ marginTop: '30px', marginBottom: '30px' }}
              withPadding
              spacing="xs"
              size="md"
              center
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck size={16} />
                </ThemeIcon>
              }
            >
              <List.Item>Clone or download repository from GitHub</List.Item>
              <List.Item>Install dependencies with yarn</List.Item>
              <List.Item>To start development server run npm start command</List.Item>
              <List.Item>Run tests to make sure your changes do not break the build</List.Item>

            </List>
          </Modal>

        </Modal>

      </BackgroundImage>
      <div style={{ zIndex: 999, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>

      </div>
    </Box>
  );
}

export default Welcome;
