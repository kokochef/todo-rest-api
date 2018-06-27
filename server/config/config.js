const port = process.env.PORT || 3000;
const mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoAPI';

module.exports = {port, mongoDBURI};