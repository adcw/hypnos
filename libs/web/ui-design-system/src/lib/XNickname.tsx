import { Text, TextProps } from '@mantine/core';

export interface XNicknameProps extends TextProps {
  value?: string;
  highlight?: boolean;
}

export const XNickname = (props: XNicknameProps) => {
  return (
    <Text
      {...props}
      // sx={(theme) => ({
      //   color: props.color,
      //   textShadow: props.highlight
      //     ? `0.5px 0.5px 2px ${theme.fn.lighten(props.color, 0.2)}`
      //     : undefined,
      // })}
      sx={(theme) => ({
        color: props.color
          ? props.highlight
            ? theme.fn.lighten(props.color, 0.6)
            : props.color
          : undefined,
      })}
    >
      {props.value ?? '???'}
    </Text>
  );
};
