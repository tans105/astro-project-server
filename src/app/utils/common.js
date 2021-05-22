const env = require('../resources/env.json');
const Logger = require('../service/logging.service')('common');
let config = null;

exports.config = () => {
    return config;
};

exports.setupConfiguration = () => {
    const runtime = process.env.ASTRO_NODE_ENV || 'development';
    config = env[runtime];
    Logger.info('Runtime Configuration', config)
}