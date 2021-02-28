const db = require('../dao/db');

module.exports = {
    store: (req, cb) => {
        const data = req.body,
            type = data['emailType'];
        let response = {
            success: true,
            msg: ''
        }

        if (type && type === 'query') {
            db.storeQuery(data).then((dbResponse) => {
                const status = dbResponse.success;

                if (status) {
                    cb(dbResponse);
                } else {
                    response.msg = 'Not able to store in the database, check configuration';
                    response.success = false;
                    cb(dbResponse);
                }
            });
        } else {
            cb(response); //Type feedback, just send Email
        }
    }
}