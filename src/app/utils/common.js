const env = require('../resources/env.json');

exports.config = () => {
  const node_env = process.env.ASTRO_NODE_ENV || 'development';
  return env[node_env];
};