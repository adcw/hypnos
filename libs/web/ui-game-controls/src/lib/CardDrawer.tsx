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

export interface CardDrawerProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  submitting?: boolean;
  onChange?: (value: string) => void;
  mode: 'view' | 'select';
}

export const CardDrawer = (props: CardDrawerProps) => {
  const context = useContext(GameContext);

  const [selecetdCard, setSelecetdCard] = useState<string | null>(null);

  const handleSubmit = () => {
    props.setOpened(false);
  };

  const handleCardClick = (src: string) => {
    setSelecetdCard(src);
    props.onChange && props.onChange(src);
  };

  useEffect(() => {
    console.log(selecetdCard);
  }, [selecetdCard]);

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
            <Text size="lg">Choose your makłowicZ</Text>
          )}
          <Group position="center" mb={12} sx={{ height: '280px' }}>
            {context &&
              context[0].me.player.cards.map((c, key) => {
                return (
                  <Card
                    onClick={() => handleCardClick(c)}
                    src={c}
                    key={key}
                    chosen={c === selecetdCard}
                  />
                );
              })}
          </Group>
          <Button onClick={handleSubmit}>Submit</Button>
        </Stack>
      </Drawer>
    </>
  );
};
