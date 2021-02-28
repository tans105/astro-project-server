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
            let status = db.storeQuery(data);

            if (status) {
                cb(true);
            } else {
                response.msg = 'Not able to store in the database, check configuration';
                response.success = false;
                cb(response);
            }
        } else {
            cb(true); //Type feedback, just send Email
        }
    }
}