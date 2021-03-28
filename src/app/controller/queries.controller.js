const express = require('express');
const DatabaseService = require('../service/database.service');
const jwt = require('jsonwebtoken');
const Logger = require('../service/logging.service')('queries.controller');
const _ = require('lodash')
const common = require('../utils/common')

const router = express.Router();
const secret = common.config().secret;
let currentUser;

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
            currentUser = decoded.email;
            next();
        });
    } else {
        res.status(401).send({isExpired: false, message: 'No Token Found'})
    }
};

router.get('/queries', auth, (req, res) => {
    DatabaseService.getQueries()
        .then(response => {
            if (response) {
                let queries = [];
                response.forEach(value => {
                    let dto = value.dataValues;
                    dto.query = JSON.parse(value.query);
                    if (dto.query.question) dto.query.question = JSON.parse(dto.query.question);
                    queries.push(dto)
                })
                res.status(200).send(queries)
            } else {
                res.status(200).send([]);
            }
        }).catch(err => Logger.error(err))
});

router.post('/updateStatus', auth, (req, res) => {
    const updatePayload = req.body;
    const id = updatePayload.id;
    const status = updatePayload.status;

    DatabaseService.updateStatus(id, status, currentUser)
        .then(response => {
            Logger.info("Status Update Successful")
            res.status(200).send(response)
        }).catch(err => Logger.error(err))
});

module.exports = router;