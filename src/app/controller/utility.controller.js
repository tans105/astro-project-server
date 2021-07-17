const express = require('express');
const DatabaseService = require('../service/database.service');
const common = require('../utils/common')
const Logger = require('../service/logging.service')('utility.controller');

const router = express.Router();

router.get('/health', (req, res) => {
    let template = `Up & Running at: ${Date.now()}`;
    Logger.info(template)
    res.send(template);
});

router.get('/info', (req, res) => {
    let template = common.config();
    res.send(template);
});

router.get('/db/health', (req, res) => {
    DatabaseService.isAuthenticated()
        .then(() => res.send('Database up and running'))
        .catch(err => res.send(err));
});

module.exports = router;