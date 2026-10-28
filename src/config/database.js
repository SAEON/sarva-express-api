const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT || 5432,
});

// Add PostGIS types for proper handling of geometry data
const types = require('pg').types;

types.setTypeParser(1700, (val) => parseFloat(val));
// Return DATE columns as 'YYYY-MM-DD' strings; the default JS Date parse shifts the day by the server's UTC offset
types.setTypeParser(1082, (val) => val);

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
