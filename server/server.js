const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {router} = require('./routes/router');
const {port} = require('./config/config');

//Express app Object
var app = express();

//Setup Middlewares
app.use(bodyParser.json());
app.use('/api', router);

//Start app to listen on Port 3000
app.listen(port, () => {
    console.log(`Started on Port ${port}`);
});

module.exports = {app};