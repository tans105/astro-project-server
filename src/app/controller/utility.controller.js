const express = require('express');
const emailService = require('../service/email.service');
const databaseService = require('../service/database.service');
const logger = require('../service/logging.service');
const router = express.Router();

router.get('/health', (req, res) => {
    let template = `Up & Running at: ${Date.now()}`;
    logger.log(template)
    res.send(template)
});

router.post('/sendEmail', function (req, res) {
    databaseService.store(req, (dbResponse) => {
        if (dbResponse.success) {
            logger.log('DB operation completed successfully.. sending Email');
            emailService.sendEmail(req, res, emailCallback);
        } else {
            logger.log('Something not right' + dbResponse.message);
            res.status(500).send(dbResponse.message);
        }
    });
});


function emailCallback(email, res) {
    if (email && email.success) {
        logger.log('Email sent success');
        res.status(200).json({status: "ok"})
    } else {
        logger.log('Failed to send email');
        res.status(500).send(email.msg);
    }
}

module.exports = router;