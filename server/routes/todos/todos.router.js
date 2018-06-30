const express = require('express');
var {todoController} = require('./../../controllers/todoController');
var {auth} = require('./../../middleware/auth');

//Express Router Middleware
var todosRouter = express.Router();

//Routes

todosRouter.get('/todos',auth, (req, res) => {
    //Call Associated todoController function
    todoController.get(req, res);
});

todosRouter.get('/todos/:id',auth, (req, res) => {
    //Call Associated todoController function
    todoController.getId(req, res);
});

todosRouter.post('/todos',auth, (req, res) => {
    //Call Associated todoController function
    todoController.post(req, res);
});

todosRouter.delete('/todos/:id',auth, (req, res) => {
    //Call associated todoController function
    todoController.deleteId(req, res);
});

todosRouter.patch('/todos/:id',auth, (req, res) => {
    //Call associated todoController function
    todoController.patchId(req, res);
});

module.exports = {todosRouter};