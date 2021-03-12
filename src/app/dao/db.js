const parseUtil = require('../utils/parse.util')
const common = require('../utils/common')
const {Client} = require('pg');
const logger = require('../service/logging.service');
const _ = require('lodash');

const dbConfig = getDbConfig();
const clientPayload = {
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    port: dbConfig.port,
    ssl: _.get(dbConfig, 'ssl', false)
}

if (dbConfig.hasOwnProperty('password')) {
    clientPayload.passowrd = dbConfig.password
}

const client = new Client(clientPayload);
client.connect();

function getDbConfig() {
    const config = common.config();
    return config.db;
}

module.exports = {
    storeQuery: (data) => {
        return new Promise((resolve) => {
            let response = {}
            let query = parseUtil.parse(data);
            if (query.success) {
                const toBeInsertedQuery = `INSERT INTO queries (email, query) VALUES ($1::text, $2::text)`;
                client.query(toBeInsertedQuery, [query.email, JSON.stringify(query)], (err, res) => {
                    if (err) {
                        logger.log('Failed to insert query ', err.toString())
                        response.success = false;
                        response.error = err;
                    } else {
                        logger.log('Query insted successfully')
                        response.success = true;
                        response.message = res;
                        // client.end();
                    }

                    resolve(response)
                });
            }
        });
    },
    seedData: () => {
        return new Promise((resolve) => {
            let response = {};
            const createQuery = `
                            create TABLE IF NOT EXISTS queries (
                                      id serial,
                                      email character varying(100),
                                      query text
                                    );
            `;
            client.query(createQuery, (err, res) => {
                if (err) {
                    logger.log('Failed to create table ' + err.toString());
                    response.success = false;
                    response.error = err;
                } else {
                    logger.log('Table created successfully');
                    response.success = true;
                    response.message = res;
                    // client.end();
                }

                resolve(response)
            });
        })
    }
}