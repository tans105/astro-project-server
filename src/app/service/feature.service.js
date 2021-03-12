const common = require('../utils/common')
const _ = require('lodash')

let features = {};

module.exports = {
    isFeatureEnabled: (code) => {
        return features[code];
    },
    bootstrap: () => {
        features = _.get(common.config(), 'feature_flags', []);
    }
}