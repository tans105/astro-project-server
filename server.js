const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const DbService = require('./src/app/service/database.service')
const FeatureService = require('./src/app/service/feature.service')
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


app.listen(port, () => {
    Logger.info(`Example app listening on port ${port}!`)
});

const bootstrap = () => {
    FeatureService.populateFeatureFlags();
    DbService.make();
    DbService.seed();
}

bootstrap();