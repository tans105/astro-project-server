const db = require('../dao/db');
const featureService = require('../service/feature.service');

module.exports = {
    store: (req, cb) => {
        if(!featureService.isFeatureEnabled('database_integration')) {
            cb({success: true});
        }

        const data = req.body,
            type = data['emailType'];

        if (type && type === 'query') {
            db.storeQuery(data).then((dbResponse) => {
                const status = dbResponse.success;

                if (status) {
                    cb(dbResponse);
                } else {
                    dbResponse.msg = 'Not able to store in the database, check configuration';
                    dbResponse.success = false;
                    cb(dbResponse);
                }
            }, (err) => {
                console.log(err);
            });
        } else {
            cb({success: true}); //Type feedback, just send Email
        }
    },
    seed: () => {
        if(!featureService.isFeatureEnabled('database_integration')) {
            return new Promise((resolve) => {
                resolve({success: true});
            });
        }

        return db.seedData();
    }
}