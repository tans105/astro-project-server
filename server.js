const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const DbService = require('./src/app/service/database.service')
const FeatureService = require('./src/app/service/feature.service')
const Common = require('./src/app/utils/common')
const Logger = require('./src/app/service/logging.service')('server')

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//Registering Controller
app.use('/util', require('./src/app/controller/utility.controller'));
app.use('/auth', require('./src/app/controller/auth.controller'));
app.use('/mail', require('./src/app/controller/email.controller'));
app.use('/api', require('./src/app/controller/queries.controller'));
app.use('/order', require('./src/app/controller/order.controller'));


app.listen(port, () => {
    Logger.info(`Example app listening on port ${port}!`)
});

const bootstrap = () => {
    Logger.info('Loading configuration ', new Date().toISOString())
    Common.setupConfiguration()

    setTimeout(() => {
        Logger.info('Seeding starts now ', new Date().toISOString())
        FeatureService.populateFeatureFlags();
        DbService.make();
        DbService.seed();
    }, 1000)
}

bootstrap();