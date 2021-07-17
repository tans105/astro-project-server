const EmailService = require('../service/email.service');
const DatabaseService = require('../service/database.service');
const express = require('express');
const Logger = require('../service/logging.service')('email.controller');

const router = express.Router();

router.post('/sendEmail', function (req, res) {
    DatabaseService.store(req, (dbResponse) => {
        if (dbResponse.success) {
            Logger.info('DB operation completed successfully.. sending Email');

            const emailPayload = req.body;
            emailPayload.uuid = dbResponse.id || -1;
            const promises = [EmailService.sendEmail(emailPayload)];

            if (emailPayload.emailType !== 'feedback') {
                const receiptEmailPayload = {
                    ...emailPayload,
                    emailType: 'receipt',
                    sendToCustomer: true,
                };
                promises.push(EmailService.sendEmail(receiptEmailPayload))
            }

            Promise.all(promises)
                .then(() => {
                    Logger.info('Email Sent');
                    res.status(200).json({status: "ok"})
                }).catch(err => {
                Logger.error('Failed to send email');
                res.status(500).send(err);
            });
        } else {
            Logger.error('Something not right' + dbResponse.message);
            res.status(500).send(dbResponse.message);
        }
    });
});

module.exports = router;