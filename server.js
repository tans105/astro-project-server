const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
const dbService = require('./src/app/service/database.service')
const logger = require('./src/app/service/logging.service');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use('/api', require('./src/app/controller/utility.controller'));

dbService.seed().then((res) => {
    logger.log(res);
}, (err) => {
    logger.log(err);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
