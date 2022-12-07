import { UnstyledButton, UnstyledButtonProps } from '@mantine/core';
import { ReactNode } from 'react';

export interface GButtonProps extends UnstyledButtonProps {
    onClick(): void;
    width?: number;
}

export function GButton(props: GButtonProps) {

    const style = {
        width: `${props.width}px`,
        textAlign: "center" as const,
        color: "#FFEEB0",
        fontSize: "18px",
        background: "#241E1E",
        padding: "10px 15px",
        borderRadius: "15px",

        '&:enabled': {
            textShadow: "0 0 10px #FFEEB0",
            transition: "text-shadow 0.3s",
        },
        '&:disabled': {
            color: "#B7B88F",
            background: "#101113"
        },
        '&:active': {
            borderTop: "3px solid black"
        },
        '&:hover': {
          background: "#101113"
        }

    }

    return (
        <UnstyledButton
            {...props}
            sx={style}
        />
    );
}




export default GButton;