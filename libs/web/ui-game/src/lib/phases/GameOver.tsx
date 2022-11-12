import { Center, Grid, Stack, Title } from '@mantine/core';

export const GameOver = () => {
  return (
    <Grid m={0} p={0}>
      <Grid.Col m={0} p={0}>
        <Center sx={{ height: '100vh' }}>
          <Stack>
            <Title
              order={2}
              variant="gradient"
              gradient={{ from: 'teal', to: 'blue' }}
            >
              Game Over!
            </Title>
          </Stack>
        </Center>
      </Grid.Col>
    </Grid>
  );
};
