const env = require('../resources/env.json');
let config = {};

exports.config = () => {
  return config;
};


exports.setupConfiguration = () => {
  const runtime = process.env.ASTRO_NODE_ENV || 'development';
  config = env[runtime];
}