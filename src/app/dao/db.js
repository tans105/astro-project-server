const ParseUtil = require('../utils/parse.util');
const Common = require('../utils/common')
const _ = require('lodash');
const {Sequelize, STRING, TEXT, DATE} = require('sequelize');
const Logger = require('../service/logging.service')('db');

let sequelize;
let Queries;
let Users;
let Configurations;
let Transactions;

const getDbConfig = () => {
    const dbConfig = Common.config().db;

    let clientPayload;

    clientPayload = {
        user: dbConfig.user || '',
        host: dbConfig.host || '',
        database: dbConfig.database || '',
        port: dbConfig.port || '5432',
        ssl: _.get(dbConfig, 'ssl', false)
    }

    if (dbConfig.hasOwnProperty('pass')) {
        clientPayload.password = dbConfig.pass
    }

    clientPayload.fromEnv = dbConfig.fromEnv
    return clientPayload;
}

const storeQuery = async (data) => {
    let query = ParseUtil.parse(data);
    if (query.success) {
        return await Queries.create({
            email: query.email,
            query: JSON.stringify(query),
            createdAt: new Date(),
            status: 'NEW'
        });
    }
}

const storeTransaction = async (uuid) => {
    return await Transactions.create({
        uuid,
        status: 'PENDING',
        creationDtm: new Date(),
        updationDtm: new Date(),
    });
}

const updateTransaction = async (uuid, status) => {
    return Transactions.update(
        {status, updationDtm: new Date()},
        {where: {uuid}}
    );
}

const seedData = async () => {
    Queries = sequelize.define('queries', {
        email: {type: STRING},
        query: {type: TEXT},
        status: {type: STRING},
        updatedBy: {type: STRING}
    });
    Users = sequelize.define('users', {
        email: {type: STRING},
        password: {type: STRING},
        sessionId: {type: TEXT},
    });
    Configurations = sequelize.define('configurations', {
        key: {type: STRING},
        value: {type: STRING},
    });
    Transactions = sequelize.define('transactions', {
        uuid: {type: STRING},
        status: {type: STRING},
        creationDtm: {type: DATE},
        updationDtm: {type: DATE}
    });

    await Queries.sync({force: false});
    await Users.sync({force: false});
    await Configurations.sync({force: false});
    await Transactions.sync({force: false});
}

const makeConnection = () => {
    const dbConfig = getDbConfig();

    if (dbConfig.fromEnv) { //Take it from environment variables
        Logger.info('Connecting to..'+process.env.DATABASE_URL)
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            protocol: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        });
    } else {
        sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
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
    }
}

const isAuthenticated = async () => {
    return sequelize.authenticate();
}

const getUser = async (email) => {
    return Users.findOne({
        where: {email}
    })
}

const getQueries = async () => {
    return Queries.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
}

const updateStatus = async (id, status, updatedBy) => {
    Queries.update(
        {status, updatedBy},
        {where: {id}}
    );
}

const createUser = async (user) => {
    return await Users.create({
        email: user.email,
        password: user.password,
    });
}

const getConfigurations = async () => {
    return await Configurations.findAll();
}

module.exports = {
    storeQuery,
    seedData,
    makeConnection,
    isAuthenticated,
    getUser,
    getQueries,
    updateStatus,
    createUser,
    getConfigurations,
    storeTransaction,
    updateTransaction,
}