export const EnvVars = {
  APP_PATH: 'APP_PATH',
  EXPRESS_PORT: 'EXPRESS_PORT',
  SOCKET_PORT: 'SOCKET_PORT',
};

export const getEnv = () => {
  const defaultValues: Record<keyof typeof EnvVars, string> = {
    APP_PATH: 'http://localhost:4200',
    EXPRESS_PORT: '3302',
    SOCKET_PORT: '3301',
  };

  return Object.fromEntries(
    Object.values(EnvVars).map((envVar) => {
      const value = process.env[envVar];
      const defVal = defaultValues[envVar];
      if (!value) {
        console.log(
          `ENV WARNING: ${envVar} is not set! Using default value: ${defVal}`
        );
      }

      return [envVar, value ?? defVal];
    })
  );
};
