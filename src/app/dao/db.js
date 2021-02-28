const parseUtil = require('../utils/parse.util')

module.exports = {
    storeQuery: (data) => {
        let query = parseUtil.parse(data);
        if (query.success) {

        }
    }
}