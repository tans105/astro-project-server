const express = require('express');
const DatabaseService = require('../service/database.service');
const jwt = require('jsonwebtoken');
const Logger = require('../service/logging.service')('queries.controller');
const _ = require('lodash')
const common = require('../utils/common')

const router = express.Router();
const secret = common.config().secret;

const auth = (req, res, next) => {
    const token = _.get(req, 'headers.authorization', null);

    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.status(401).send({isExpired: true, message: 'Token Expired'})
                } else {
                    res.status(401).send({isExpired: false, message: 'Invalid Token'})
                }
            }
            next();
        });
    } else {
        res.status(401).send({isExpired: false, message: 'No Token Found'})
    }
};

router.get('/queries', auth, (req, res) => {
    DatabaseService.getQueries()
        .then(queries => {
            if (queries) {
                queries.forEach(query => {
                    if(query.question) query.question = JSON.parse(query.question);
                })
                res.status(200).send(queries.map(query => JSON.parse(query.dataValues.query)))
            } else {
                res.status(200).send([]);
            }
        }).catch(err => Logger.error(err))
});
module.exports = router;