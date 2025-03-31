require('dotenv').config({ path: './.env' });

const app = require('./src/app');
const logger = require('./src/config/logger');

const PORT = process.env.PORT;

app.listen(PORT, '127.0.0.1', () => {
  logger.info(`Server running on port ${PORT}`);
});
