//Require in Todo Model
var {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

//Setup todoController Object
const todoController = {}

//Function to handle GET /todos
todoController.get = (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
};

//Function to handle GET /todos/:id
todoController.getId = (req, res) => {
    var id = req.params.id;
    
    //If ID sent is not valid
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        //If no todo exists with send ID
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => res.status(400).send());
};

//Function to handle POST /todos
todoController.post = (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
};

//Function to handle DELETE /todos/:id
todoController.deleteId = (req, res) => {
    var id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((err) => res.status(404).send());
};

//Function to handle PATCH /todos/:id
todoController.patchId = (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
};

module.exports = {todoController};