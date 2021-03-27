const express = require('express');
const Logger = require('../service/logging.service')('auth.controller');
const DatabaseService = require('../service/database.service');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const common = require('../utils/common')

const router = express.Router();
const secret = common.config().secret;

router.post('/login', (req, res) => {
    const loginPayload = req.body;

    if (!_.has(loginPayload, 'user.email')) {
        res.status(422).send('Email missing');
    }

    let user = DatabaseService.getUser(loginPayload.user.email)
        .then(user => {
            if (_.has(user, 'dataValues')) {
                let token = jwt.sign({email: user.dataValues.email}, secret, {expiresIn: '24h'});
                res.status(200).send({token});
            } else {
                res.status(401).send('Unauthorized User');
            }
        }).catch(err => res.status(500).send(err))
});

module.exports = router;