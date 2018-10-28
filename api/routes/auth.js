const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');
const secret = require('../../config/keys');
const axios = require('axios');
const chatkit = require('../../Config/chatkit');

//load input validation for register and login
//you can create more of these validation or use lodash library for validation if your model require complex validations
const validInput = require('../../Validation/register');
const validLogin = require('../../Validation/login');


//@route POST api/auth/register
//@description register  the users
//@access public route

router.post('/register', (req, res) => {
  const { errors, isValid } = validInput(req.body);
  console.log(req.body)
  //check validation
  if (!isValid) {
    res.status(400).json(errors);

  } else {
    let query = User.findOne({ email: req.body.email })
      .then((user) => {
        console.log('object')
        if (user) {
          errors.email = 'Email already exists'
          return res.status(400).json(errors)
        } else {

          newUser = new User(
            {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              githubusername: req.body.username
            }
          );

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then((user) => {
                  console.log(user)
                  //this will be send as a response to the application
                  //create a chatkit user here
                  chatkit.createUser({
                    id: user._id,
                    name: user.name,
                  })
                    .then(() => {
                      console.log('User created successfully');
                    }).catch((err) => {
                      console.log(err);
                    });
                  const resUser = {
                    name: user.name,
                    email: user.email,
                  }
                  res.json(resUser)
                })

                .catch(err => console.log(err));
            })
          })
        }

      })

  }

});

//@route GET api/auth/login
//@description login  the users/ returning the jwt
//@access public route

router.post('/login', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validLogin(req.body);
  console.log(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }
  //find user by email
  User.findOne({ email })
    .then((user) => {
      //check for user
      if (!user) {
        errors.email = 'user not found'
        res.status(404).json(errors)
      }
      console.log(user)
      //check password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            //user matched
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            } //created jwt payload

            //sign token
            jwt.sign(payload, secret.secretOrKey, { expiresIn: 360000 }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
          } else {
            //user not matched
            errors.password = 'incorrect password';
            return res.status(400).json(errors)
          }
        })
    })
});


router.get('/github', (req, res) => {
  const { query } = req;
  const { code } = query;
  console.log(code)
  if (!code) {
    res.status(400).json({
      errors: 'Auth failed',
      success: false
    })
  }

  axios.post('https://github.com/login/oauth/access_token', {
    client_id: '3641e84228dcf2c013f7',
    client_secret: '5b80b58068b439ce2c3ab86e0e8ee9f317ecd008',
    code: code,
    scope: 'repo'
  })
    .then((response) => {
      console.log('access_token', response.data);
      axios.get(`https://api.github.com/user?${response.data}`)
        .then((userData) => {
          console.log(userData)
          const userinfo = userData.data;
          newUser = new User(
            {
              name: userinfo.name,
              email: userinfo.email,
              githubusername: userinfo.login,
              githubToken: response.data,
              avatar: userinfo.avatar_url,

            }
          )
          User.findOne({ githubusername: userinfo.login })
            .then((data) => {
              if (data) {
                const payload = {
                  id: data.id,
                  name: data.name,
                  avatar: data.avatar
                }
                //sign token
                jwt.sign(payload, secret.secretOrKey, { expiresIn: 360000 }, (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
                });
              } else {
                console.log('object', newUser)
                newUser.save()
                  .then((savedUser) => {
                    //create a user in chatkit
                    chatkit.createUser({
                      id: savedUser.githubusername,
                      name: savedUser.name,
                      avatarURL: savedUser.avatar
                    })
                      .then(() => {
                        console.log('User created successfully');
                      }).catch((err) => {
                        console.log(err);
                      });
                    const payload = {
                      id: savedUser.id,
                      name: savedUser.name,
                      avatar: savedUser.avatar
                    }
                    //sign token
                    jwt.sign(payload, secret.secretOrKey, { expiresIn: 360000 }, (err, token) => {
                      res.json({
                        success: true,
                        token: 'Bearer ' + token
                      });
                    });
                  })
                  .catch((err) => {
                    console.log(err)
                    res.json({
                      success: false,
                      error: 'some error'
                    })
                  })
              }

            })
        })
        .catch((err) => {
          console.log(err);
        })

    })
    .catch((err) => {
      console.log(err)
      res.json({
        errors: 'Failed',
        success: false
      })
      console.log(err)
    })
});


router.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id
  });

  res.status(authData.status)
    .send(authData.body);
});


module.exports = router;