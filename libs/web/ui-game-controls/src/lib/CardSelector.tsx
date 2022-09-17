import { Group, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Card } from './Card';

export interface CardSelectorProps {
  cards: string[];
  onSubmit?: (src: string) => void;
  onSelectionChange?: (src: string) => void;
}

export const CardSelector = (props: CardSelectorProps) => {
  const [selecetdCard, setSelecetdCard] = useState<string | null>(null);

  const handleSubmit = () => {
    props.onSubmit && selecetdCard && props.onSubmit(selecetdCard);
  };

  useEffect(() => {
    console.log(selecetdCard);
  }, [selecetdCard]);

  const handleCardClick = (src: string) => {
    setSelecetdCard(src);
    props.onSelectionChange && props.onSelectionChange(src);
  };

  return (
    <>
      <Group position="center" mb={12} sx={{ height: '280px' }}>
        {props.cards.map((c, key) => {
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
      <Button onClick={handleSubmit} disabled={!selecetdCard}>
        Submit
      </Button>
    </>
  );
};
