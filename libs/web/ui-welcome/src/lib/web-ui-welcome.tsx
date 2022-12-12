import styles from './web-ui-welcome.module.css';
import { List, Box, Modal, BackgroundImage, Center, Card, Group, Button, Image, Badge, Text, Paper, Container, Title, ThemeIcon } from '@mantine/core';
import image from "../lib/background.jpg";
import logo from "../lib/logo.png";
import { useState } from 'react';
import { IconStar, IconArrowBigRight } from '@tabler/icons';
import { useNavigate } from "react-router-dom";
import { sx } from '../../../ui-design-system/src/lib/buttonSX'


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
              onClick={() => navigate("/game")}
              sx={sx}
            >Play Game</Button>
          </Center>
          <Center style={{ marginTop: '50px', marginBottom: '50px' }}>
            <Button
              onClick={() => setOpened(true)}
              sx={sx}
            >Game Manual</Button>
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
                <ThemeIcon color="orange" size={24} radius="xl">
                  <IconArrowBigRight size={16} />
                </ThemeIcon>
              }
            >
              <List.Item>Choose card and create a phrase to describe the picture</List.Item>
              <List.Item>Make sure that phrase is not too easy to guess</List.Item>
              <List.Item>Let others try to pick card that match your phrase</List.Item>
              <List.Item>Voting Time! Everyone votes on a card that matches best to phrase in their opinion</List.Item>
              <List.Item>Earn points and swap roles with other players in next rounds</List.Item>
              <br></br>
              <List.Item icon={
                 <ThemeIcon color="yellow" size={24} radius="xl">
                  <IconStar />
                 </ThemeIcon>
                 }>Get the most points and win! </List.Item>
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
