import { GameContext } from '@hypnos/web/network';
import {
  Affix,
  ActionIcon,
  Drawer,
  Text,
  Group,
  Image,
  Stack,
  Loader,
  LoadingOverlay,
  Button,
} from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { GiCardPick } from 'react-icons/gi';
import { Card } from './Card';
import { CardSelector } from './CardSelector';

export interface CardDrawerProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  submitting?: boolean;
  onChange: (value: string) => void;
  value: string | null;
  mode: 'view' | 'select';
}

export const CardDrawer = (props: CardDrawerProps) => {
  const context = useContext(GameContext);

  const handleSubmit = (src: string) => {
    props.setOpened(false);
  };

  return (
    <>
      <Affix>
        <ActionIcon
          variant="filled"
          size={'xl'}
          onClick={() => props.setOpened(true)}
        >
          <GiCardPick />
        </ActionIcon>
      </Affix>
      <Drawer
        opened={props.opened}
        onClose={() => props.setOpened(false)}
        position="bottom"
        withOverlay={true}
        withCloseButton={false}
        size={440}
        padding="md"
      >
        <Stack align="center">
          {props.mode === 'select' && <Text size="lg">Choose your card</Text>}
          <CardSelector
            mode={props.mode}
            cards={context?.[0].me.player.cards ?? []}
            onChange={props.onChange}
            value={props.value}
          />
          {/*  */}
        </Stack>
      </Drawer>
    </>
  );
};
