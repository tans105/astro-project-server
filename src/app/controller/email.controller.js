const EmailService = require('../service/email.service');
const express = require('express');
const Logger = require('../service/logging.service')('email.controller');

const router = express.Router();

router.post('/sendEmail', function (req, res) {
    const emailPayload = req.body;
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
        .then(emailResponse => {
            Logger.info('Email Sent');
            res.status(200).json({status: "ok"})
        }).catch(err => {
        Logger.error('Failed to send email');
        res.status(500).send(err);
    });
});

module.exports = router;