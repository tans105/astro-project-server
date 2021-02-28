const parseUtil = require('../utils/parse.util')
const common = require('../utils/common')

let MongoClient = require('mongodb').MongoClient;

function getDbUrl() {
    const config = common.config();
    return config.db.url;
}

module.exports = {
    storeQuery: (data) => {
        return new Promise((resolve) => {
            let response = {}
            let query = parseUtil.parse(data);
            if (query.success) {
                MongoClient.connect(getDbUrl(), function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("mb");
                    dbo.collection("queries").insertOne({query}, (err, result) => {
                        if (err) {
                            response.success = false;
                            response.message = err;
                            db.close().then(r => console.log('Connection closed !'));
                        } else {
                            response.success = true;
                            response.message = result;
                        }
                        resolve(response);
                    });
                });
            }
        });
    }
}