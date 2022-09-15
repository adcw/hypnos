import { Text } from '@mantine/core';

export interface XNicknameProps {
  value?: string;
  color: string;
  highlight?: boolean;
}

export const XNickname = (props: XNicknameProps) => {
  return (
    <Text
      sx={(theme) => ({
        color: props.color,
        textShadow: props.highlight
          ? `0.5px 0.5px 2px ${theme.fn.lighten(props.color, 0.2)}`
          : undefined,
      })}
    >
      {props.value ?? '???'}
    </Text>
  );
};
