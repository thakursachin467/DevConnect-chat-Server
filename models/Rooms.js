const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema

const RoomsSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true
  }
});

const room = mongoose.model('rooms', RoomsSchema);
module.exports = room;