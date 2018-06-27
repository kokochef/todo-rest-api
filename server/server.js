var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {router} = require('./routes/router');

//Express app Object
var app = express();

//Setup Middlewares
app.use(bodyParser.json());
app.use('', router);

//Start app to listen on Port 3000
app.listen(3000, () => {
    console.log('Started on Port 3000');
});

module.exports = {app};