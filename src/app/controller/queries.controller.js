const express = require('express');

const Logger = require('../service/logging.service')('queries.controller');
const DatabaseService = require('../service/database.service');
const {authInterceptor, getCurrentUser} = require('../service/auth.service')

const router = express.Router();

router.get('/queries', authInterceptor, (req, res) => {
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

router.post('/updateStatus', authInterceptor, (req, res) => {
    const updatePayload = req.body;
    const id = updatePayload.id;
    const status = updatePayload.status;

    DatabaseService.updateStatus(id, status, getCurrentUser())
        .then(response => {
            Logger.info("Status Update Successful")
            res.status(200).send(response)
        }).catch(err => Logger.error(err))
});

module.exports = router;