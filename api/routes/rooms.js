const express = require('express');
const router = express.Router();

const Room = require('../../models/Rooms');

const chatkit = require('../../Config/chatkit');
const shortid = require('shortid');


//@route POST /api/room/invite/:name
//@description create a room
//@access private route


router.post('/invite/:teamId', (req, res) => {
  const { teamId } = req.params;
  Room.findOne({ roomId: teamId })
    .then((room) => {
      console.log(room);
      if (!room) {
        const id = shortid.generate();
        const data = new Room({
          roomId: teamId,
          token: id
        })
        data.save()
          .then((resp) => {
            const link = `https://admiring-snyder-dead31.netlify.com/invite/${id}`;
            res.json({
              success: true,
              token: `https://admiring-snyder-dead31.netlify.com/invite/${resp.token}`
            });
          })
          .catch((err) => {
            console.log(err);
          })
      } else {
        res.json({
          success: true,
          token: `https://admiring-snyder-dead31.netlify.com/invite/${room.token}`
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })


});


//@route POST /api/room/add/:name
//@description delete a room
//@access private route

router.post('/add/:id', (req, res) => {
  const userId = req.body.user;
  const id = req.params.id;
  Room.findOne({ token: id })
    .then((room) => {
      console.log(room);
      if (!room) {
        res.status(400).json({
          success: false
        });
      } else {

        chatkit.addUsersToRoom({
          roomId: room.roomId,
          userIds: [userId]
        })
          .then(() => {
            res.json({
              success: true,
              team: room.roomId
            });
          }
          )
          .catch(err => {
            console.error(err)
            res.status(400).json({
              success: false,
            });
          })

      }
    })
    .catch((err) => {
      console.log(err);
    })

});


router.post('/delete/:id', (req, res) => {
  const roomId = req.params.id;
  chatkit.deleteRoom({
    id: Number(roomId)
  })
    .then(() => {
      res.status(200).json({
        sucess: true
      })
      console.log('gone forever')
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        sucess: false,
        error: err
      })
    })
});


module.exports = router;