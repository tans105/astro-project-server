const express = require('express');
const _ = require('lodash');
const Logger = require('../service/logging.service')('auth.controller');

const {
    authenticateUser,
    authInterceptor,
    registerUser,
    getHashedPassword
} = require('../service/auth.service');

const router = express.Router();

router.post('/register', authInterceptor, (req, res) => {
    const registerPayload = req.body;

    if (!_.has(registerPayload, 'email') || !_.has(registerPayload, 'password')) {
        res.status(422).send('Mandatory Params missing');
    }

    const hashedPassword = getHashedPassword(registerPayload.password)
        .then((hash) => {
            let user = {
                email: registerPayload.email,
                password: hash
            }
            registerUser(user)
                .then((dbRes) => {
                    let user = _.get(dbRes, 'dataValues')
                    res.status(200).send({user});
                })
                .catch(err => {
                    Logger.error('Something went wrong. ' + err)
                    res.status(500).send(err)
                })
        })
});

router.post('/login', (req, res) => {
    const loginPayload = req.body;

    if (!_.has(loginPayload, 'user.email')) {
        res.status(422).send('Email missing');
    }

    authenticateUser(loginPayload).then(({success, message, token}) => {
        if (!success) {
            res.status(401).send({message});
        } else {
            res.status(200).send({token});
        }
    });
});

module.exports = router;