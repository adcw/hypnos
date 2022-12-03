import { Group, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Card } from './Card';

export interface CardSelectorProps {
  cards: string[];
  onChange?: (src: string) => void;
  value: string | null;
  mode: 'view' | 'select';
}

export const CardSelector = (props: CardSelectorProps) => {
  const [selecetdCard, setSelecetdCard] = useState<string | null>(props.value);

  const handleCardClick = (src: string) => {
    if (props.mode !== 'select') return;
    setSelecetdCard(src);
    props.onChange && props.onChange(src);
  };

  return (
    <Group position="center" mb={12} sx={{ height: '220px' }}>
      {props.cards.map((c, key) => {
        return (
          <Card
            onClick={() => handleCardClick(c)}
            src={c}
            key={key}
            chosen={props.mode === 'select' && c === selecetdCard}
          />
        );
      })}
    </Group>
  );
};
