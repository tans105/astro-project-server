const express = require('express');
const emailService = require('../service/emailService');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
});

router.get('/health', (req, res) => {
    let template = `Up & Running at: ${Date.now()}`;
    console.log(template)
    res.send(template)
});

//send email endpoint
router.post('/sendEmail', function (req, res) {
    emailService.sendEmail(req.body);
});

module.exports = router;