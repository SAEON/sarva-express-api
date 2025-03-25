module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'dev',
  jwtSecret: process.env.JWT_SECRET || '',
};
