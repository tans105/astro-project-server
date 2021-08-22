const _ = require('lodash');

const env = require('../resources/env.json');
const Logger = require('../service/logging.service')('common');
const Razorpay = require('razorpay');

let config = null;
let secret = null;
let gatewayInstance;

exports.config = () => {
    return config;
};

exports.setupConfiguration = () => {
    const runtime = process.env.ASTRO_NODE_ENV || 'development';
    config = env[runtime];
    Logger.info('Runtime Config', config)
    setupPayment(config);
}

const setupPayment = (config) => {
    const paymentConfig = _.get(config, 'payment', {})
    gatewayInstance = new Razorpay(paymentConfig);
}

exports.getSecret = () => {
    return secret;
}

exports.setSecret = (sec) => {
    secret = sec.value;
}

exports.gatewayInstance = () => {
    return gatewayInstance;
}
