const env = require('../resources/env.json');

exports.config = () => {
  const node_env = process.env.NODE_ENV || 'development';
  return env[node_env];
};