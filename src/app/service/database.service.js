const db = require('../dao/db');

module.exports = {
    store: (req, cb) => {
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
            });
        } else {
            cb({success: true}); //Type feedback, just send Email
        }
    },
    seed: () => {
        return db.seedData();
    }
}