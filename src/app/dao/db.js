const ParseUtil = require('../utils/parse.util');
const Common = require('../utils/common')
const _ = require('lodash');
const {Sequelize, STRING, TEXT} = require('sequelize');
const Logger = require('../service/logging.service')('db');

let sequelize;
let Queries;

const getDbConfig = () => {
    const dbConfig = Common.config().db;
    let clientPayload;

    clientPayload = {
        user: dbConfig.user,
        host: dbConfig.host,
        database: dbConfig.database,
        port: dbConfig.port,
        ssl: _.get(dbConfig, 'ssl', false)
    }

    if (dbConfig.hasOwnProperty('password')) {
        clientPayload.passowrd = dbConfig.password
    }
    return clientPayload;
}

const storeQuery = async (data) => {
    let query = ParseUtil.parse(data);
    if (query.success) {
        return await Queries.create({
            email: query.email,
            query: JSON.stringify(query),
            createdAt: new Date()
        });
    }
}

const seedData = async () => {
    Queries = sequelize.define('queries', {
        email: {type: STRING},
        query: {type: TEXT},
    });

    return Queries.sync({force: false})
}

const makeConnection = () => {
    const dbConfig = getDbConfig();
    sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.passowrd, {
        host: dbConfig.host,
        dialect: 'postgres',
        operatorsAliases: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });

    sequelize.authenticate()
        .then(() => Logger.info('Database Connection has been established successfully.'))
        .catch(err => Logger.error('Unable to connect to the database:', err));
}

module.exports = {
    storeQuery,
    seedData,
    makeConnection
}