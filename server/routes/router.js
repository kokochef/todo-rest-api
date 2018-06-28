var express = require('express');
var {todoController} = require('./../controllers/todoController');

//Express Router Middleware
var router = express.Router();

//Routes

router.get('/todos', (req, res) => {
    //Call Associated todoController function
    todoController.get(req, res);
});

router.get('/todos/:id', (req, res) => {
    //Call Associated todoController function
    todoController.getId(req, res);
});

router.post('/todos', (req, res) => {
    //Call Associated todoController function
    todoController.post(req, res);
});

router.delete('/todos/:id', (req, res) => {
    //Call associated todoController function
    todoController.deleteId(req, res);
});

router.patch('/todos/:id', (req, res) => {
    //Call associated todoController function
    todoController.patchId(req, res);
});

module.exports = {router};