import { Card, CardProps } from '@mantine/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface XCardProps extends CardProps {}

export const XCard = (props: XCardProps) => {
  return <Card {...props}></Card>;
};
