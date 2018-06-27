var mongoose = require('mongoose');
const {mongoDBURI} = require('./../config/config');

mongoose.Promise = global.Promise;
mongoose.connect(mongoDBURI);

module.exports = {mongoose};