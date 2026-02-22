import { loadEnvFile } from 'node:process';

loadEnvFile(process.env.DOTENV_CONFIG_PATH);

/******************************************************************************
                                 Constants
******************************************************************************/

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

/******************************************************************************
                                 Setup
******************************************************************************/

const EnvVars =
{
  NodeEnv: process.env.NODE_ENV || 'development',
  Port: process.env.PORT || '3000',
};

/******************************************************************************
                            Export default
******************************************************************************/

export default EnvVars;
