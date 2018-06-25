//Require in Todo Model
var {Todo} = require('./../models/todo');

//Setup todoController Object
const todoController = {}

//Function to handle GET /todos
todoController.get = (req, res) => {
    Todo.find().then((todos) => {
        res.send(todos);
    }, (err) => {
        res.status(400).send(err);
    });
};

//Function to handle POST /todos
todoController.post = (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
};

module.exports = {todoController};