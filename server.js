const express = require('express');
const app = express();
const port = 8000;

app.use('/api', require('./src/app/controller/utilityController'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
