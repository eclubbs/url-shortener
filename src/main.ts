import logger from 'jet-logger';
import EnvVars from './common/constants/env';
import server from './server';
import { loadEnvFile } from 'node:process';



loadEnvFile(process.env.DOTENV_CONFIG_PATH);

console.log(process.env);

/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MESSAGE =
  'Express server started on port: ' + EnvVars.Port.toString();

/******************************************************************************
                                  Run
******************************************************************************/

// Start the server
server.listen(EnvVars.Port, (err) => {
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info(SERVER_START_MESSAGE);
  }
});
