const _ = require('lodash');

const env = require('../resources/env.json');
const Logger = require('../service/logging.service')('common');
const Razorpay = require('razorpay');

let config = null;
let dbConfig = null;
let gatewayInstance = null;

exports.setupConfiguration = () => {
    const runtime = process.env.ASTRO_NODE_ENV || 'development';
    config = env[runtime];
    Logger.info('Runtime Config', config)
}

const setupPayment = () => {
    gatewayInstance = new Razorpay(JSON.parse(dbConfig['payment']));
}

exports.config = () => config;
exports.dbConfig = () => dbConfig;
exports.getDbConfig = key => dbConfig[key];
exports.getSecret = () => dbConfig['secret'];
exports.gatewayInstance = () => gatewayInstance;

exports.setDbConfig = config => {
    dbConfig = config;
    setupPayment();
};
