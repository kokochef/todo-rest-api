const _ = require('lodash');

var {User} = require('./../models/user');

const userController = {}

userController.post = (req, res) => {
    //Pick the body out of the Request Object
    var body = _.pick(req.body, ['email', 'password']);

    //Create a new instance of User
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
};

userController.authenticate = (req, res) => {
    res.send(req.user);
};

userController.login = (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(404).send();
    });
};

userController.logout = (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
};

module.exports = {userController}; 