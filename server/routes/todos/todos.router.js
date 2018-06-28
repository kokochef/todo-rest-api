var express = require('express');
var {todoController} = require('./../../controllers/todoController');

//Express Router Middleware
var todosRouter = express.Router();

//Routes

todosRouter.get('/todos', (req, res) => {
    //Call Associated todoController function
    todoController.get(req, res);
});

todosRouter.get('/todos/:id', (req, res) => {
    //Call Associated todoController function
    todoController.getId(req, res);
});

todosRouter.post('/todos', (req, res) => {
    //Call Associated todoController function
    todoController.post(req, res);
});

todosRouter.delete('/todos/:id', (req, res) => {
    //Call associated todoController function
    todoController.deleteId(req, res);
});

todosRouter.patch('/todos/:id', (req, res) => {
    //Call associated todoController function
    todoController.patchId(req, res);
});

module.exports = {todosRouter};