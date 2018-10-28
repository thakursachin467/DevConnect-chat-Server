const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const chatkit = require('../../Config/chatkit');


//@route POST /api/room/createRoom/:name
//@description create a room
//@access private route

router.get('/createRoom/:name', (req, res) => {

});


//@route POST /api/room/deleteRoom/:name
//@description delete a room
//@access private route

router.get('/deleteRoom/:id', (req, res) => {

});


module.exports = router;