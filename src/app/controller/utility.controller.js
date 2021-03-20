const express = require('express');
const EmailService = require('../service/email.service');
const DatabaseService = require('../service/database.service');
const Logger = require('../service/logging.service')('utility.controller');

const router = express.Router();

router.get('/health', (req, res) => {
    let template = `Up & Running at: ${Date.now()}`;
    Logger.log(template)
    res.send(template)
});

router.get('/db/health', (req, res) => {
    DatabaseService.isAuthenticated()
        .then(() => res.send('Database up and running'))
        .catch(err => res.send(err));
});

router.post('/sendEmail', function (req, res) {
    DatabaseService.store(req, (dbResponse) => {
        if (dbResponse.success) {
            Logger.info('DB operation completed successfully.. sending Email');
            EmailService.sendEmail(req, res, emailCallback);
        } else {
            Logger.error('Something not right' + dbResponse.message);
            res.status(500).send(dbResponse.message);
        }
    });
});


function emailCallback(email, res) {
    if (email && email.success) {
        Logger.info('Email Sent');
        res.status(200).json({status: "ok"})
    } else {
        Logger.error('Failed to send email');
        res.status(500).send(email.msg);
    }
    res.end(email)
}

module.exports = router;