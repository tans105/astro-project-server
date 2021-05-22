const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const DatabaseService = require('./database.service');
const Logger = require('./logging.service')('auth.service');

const common = require('../utils/common')

let currentUser;

const authInterceptor = (req, res, next) => {
    const token = _.get(req, 'headers.authorization', null);
    const secret = common.config().secret;

    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    Logger.info('Token Expired')
                    res.status(401).send({isExpired: true, message: 'Token Expired'})
                } else {
                    Logger.info('Invalid Token')
                    res.status(401).send({isExpired: false, message: 'Invalid Token'})
                }
            }
            validateUser(decoded.email)
                .then(validateResponse => {
                    if (!_.isNil(validateResponse)) {
                        currentUser = decoded.email;
                        next();
                    } else {
                        Logger.error('User does not exists ' + decoded.email)
                        res.status(401).send({isExpired: false, message: 'User does not exists'})
                    }
                })
                .catch(validateResponse => {
                    Logger.error(validateResponse)
                    res.status(401).send({isExpired: false, message: validateResponse})
                })
        });
    } else {
        Logger.info('No Token Found')
        res.status(401).send({isExpired: false, message: 'No Token Found'})
    }
};

const validateUser = async (email) => {
    return DatabaseService.getUser(email)
}

const getCurrentUser = () => {
    return currentUser;
}

const getLoginToken = (email, expiresIn) => {
    const secret = common.config().secret;
    return jwt.sign({email: email}, secret, {expiresIn: expiresIn});
}

const authenticateNonSocial = async (formPayload, dbPayload) => {
    let dbPassword = dbPayload.password,
        formPassword = formPayload.user.password

    return bcrypt.compare(formPassword, dbPassword);
}

const authenticateUser = async (loginPayload) => {
    const isSocial = loginPayload['isSocial'];

    return DatabaseService.getUser(loginPayload.user.email)
        .then(user => {
            if (isSocial) {
                if (_.has(user, 'dataValues')) {
                    return new Promise(resolve => {
                        resolve({
                            success: true,
                            message: '',
                            token: getLoginToken(user.dataValues.email, '72h')
                        })
                    })
                }
            } else {
                return authenticateNonSocial(loginPayload, user.dataValues)
                    .then(match => {
                        if (match) {
                            return new Promise(resolve => {
                                resolve({
                                    success: true,
                                    message: '',
                                    token: getLoginToken(user.dataValues.email, '72h')
                                })
                            })
                        } else {
                            return new Promise(resolve => {
                                resolve({
                                    success: false,
                                    message: 'Login Password did not match',
                                })
                            })
                        }
                    })
            }
        }).catch(err => {
            return {success: false, message: err}
        })
}

const getHashedPassword = async (password) => {
    return bcrypt.hash(password, saltRounds);
}

const registerUser = async (user) => {
    return DatabaseService.createUser(user)
}

module.exports = {
    authInterceptor,
    getCurrentUser,
    authenticateUser,
    getHashedPassword,
    registerUser
}