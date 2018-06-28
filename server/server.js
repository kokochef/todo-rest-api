const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {todosRouter, usersRouter} = require('./routes/routes');
const {port} = require('./config/config');

//Express app Object
var app = express();

//Setup Middlewares
app.use(bodyParser.json());
app.use('/api', todosRouter);
app.use('/api', usersRouter);

//Start app to listen on Port set by Environment
app.listen(port, () => {
    console.log(`Started on Port ${port}`);
});

module.exports = {app};