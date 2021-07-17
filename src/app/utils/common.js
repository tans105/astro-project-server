const _ = require('lodash');

const env = require('../resources/env.json');
const Logger = require('../service/logging.service')('common');


let config = null;
let secret = null;

exports.config = () => {
    return config;
};

exports.setupConfiguration = () => {
    const runtime = process.env.ASTRO_NODE_ENV || 'development';
    config = env[runtime];
    Logger.info('Runtime Config', config)
}

exports.getSecrets = () => {
    return secret;
}

exports.setSecret = (sec) => {
    secret = sec.value;
}