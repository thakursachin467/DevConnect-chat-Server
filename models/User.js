const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  githubToken: {
    type: String
  },
  githubusername: {
    type: String
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const user = mongoose.model('users', UserSchema);
module.exports = user;