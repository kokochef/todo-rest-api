const express = require('express');
const {auth} = require('./../../middleware/auth');

//User Controller
var {userController} = require('./../../controllers/userController');

//Express Router Middleware
var usersRouter = express.Router();

//POST /users
usersRouter.post('/users', (req, res) => {
    userController.post(req, res);
});

//GET /users/me
usersRouter.get('/users/me',auth, (req, res) => {
    userController.authenticate(req, res);
});

module.exports= {usersRouter};