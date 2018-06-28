const express = require('express');

//User Controller
var {userController} = require('./../../controllers/userController');

//Express Router Middleware
var usersRouter = express.Router();

//POST /users
usersRouter.post('/users', (req, res) => {
    userController.post(req, res);
});

module.exports= {usersRouter};