const DB = require('../dao/db');
const FeatureService = require('../service/feature.service');
const Logger = require('../service/logging.service')('database.service')

const make = () => DB.makeConnection();

const store = (req, cb) => {
    if (!FeatureService.isFeatureEnabled('database_integration')) {
        cb({success: true});
    }

    const data = req.body,
        type = data['emailType'];

    if (type && type === 'query') {
        DB.storeQuery(data)
            .then((query) => {
                Logger.info("Query create auto-generated ID:", query.id);
                cb({success: true})
            })
            .catch((err) => Logger.error(err));
    } else {
        cb({success: true}); //Type feeDBack, just send Email
    }
}

const seed = () => {
    if (!FeatureService.isFeatureEnabled('database_integration')) {
        return;
    }

    DB.seedData()
        .then(() => Logger.info('Table created Successfully'))
        .catch(err => Logger.error(err));
}

const isAuthenticated = () => {
    return DB.isAuthenticated();
}

const getUser = async (email) => {
    return DB.getUser(email);
}

const getQueries = () => {
    return DB.getQueries();
}

const updateStatus = (id, status, updatedBy) => {
    return DB.updateStatus(id, status, updatedBy);
}

const createUser = async (user) => {
    return DB.createUser(user);
}

module.exports = {
    store,
    seed,
    make,
    isAuthenticated,
    getUser,
    getQueries,
    updateStatus,
    createUser
}