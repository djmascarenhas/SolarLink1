import { createAppServer } from './app.js';
import { logger } from './observability/logger.js';

const port = Number(process.env.PORT || 4173);
const server = createAppServer();

server.listen(port, () => {
  logger.info('server_started', { port });
});
