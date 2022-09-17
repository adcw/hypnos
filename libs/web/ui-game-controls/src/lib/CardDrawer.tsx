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
import { useLongPress } from 'libs/web/ui-game/src/lib/phases/hooks';
import { useContext, useEffect, useState } from 'react';
import { GiCardPick } from 'react-icons/gi';
import { Card } from './Card';
import { CardSelector } from './CardSelector';

export interface CardDrawerProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  submitting?: boolean;
  onChange?: (value: string) => void;
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
          {props.mode === 'select' && (
            <>
              <Text size="lg">Choose your makłowicZ</Text>
              <CardSelector
                cards={context?.[0].me.player.cards ?? []}
                onSubmit={handleSubmit}
              />
            </>
          )}
          {/*  */}
        </Stack>
      </Drawer>
    </>
  );
};