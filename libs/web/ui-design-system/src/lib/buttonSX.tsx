export const sx = {
    textAlign: "center" as const,
    color: "#FFEEB0",
    fontSize: "18px",
    background: "#241E1E",

    '&:enabled': {
        textShadow: "0 0 10px #FFEEB0",
        transition: "text-shadow 0.3s",
    },
    '&:disabled': {
        color: "#3b3c3f",
        background: "#101113"
    },
    '&:active': {
        borderTop: "3px solid black"
    },
    '&:hover': {
        background: "#101113"
    }
}