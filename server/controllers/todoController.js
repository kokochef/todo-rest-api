//Require in Todo Model
var {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');

//Setup todoController Object
const todoController = {}

//Function to handle GET /todos
todoController.get = (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
};

todoController.getId = (req, res) => {
    var id = req.params.id;
    
    //If ID sent is not valid
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        //If no todo exists with send ID
        if (!todo) {
            return res.status(404).send();
        }

        return res.send({todo});
    }).catch((e) => res.status(400).send());
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