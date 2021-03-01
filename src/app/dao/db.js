const parseUtil = require('../utils/parse.util')
const common = require('../utils/common')
const {Client} = require('pg');

const dbConfig = getDbConfig();
const client = new Client({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    port: dbConfig.port,
});

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
                        response.success = false;
                        response.error = err;
                        return;
                    } else {
                        response.success = true;
                        response.message = res;
                        client.end();
                    }

                    resolve(response)
                });
            }
        });
    }
}