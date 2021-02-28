const express = require('express');
const emailService = require('../service/email.service');
const databaseService = require('../service/database.service');
const router = express.Router();

router.get('/health', (req, res) => {
    let template = `Up & Running at: ${Date.now()}`;
    console.log(template)
    res.send(template)
});

//send email endpoint
router.post('/sendEmail', function (req, res) {
    databaseService.store(req, (dbResponse) => {
        if (dbResponse.success) {
            emailService.sendEmail(req, res, emailCallback);
        } else {
            res.status(500).send(dbResponse.message);
        }
    });
});


function emailCallback(email, res) {
    if (email && email.success) {
        res.status(200).json({status: "ok"})
    } else {
        res.status(500).send(email.msg);
    }
}

module.exports = router;