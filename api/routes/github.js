const express = require('express');
const router = express.Router();
const chatkit = require('../../Config/chatkit');
const User = require('../../models/User');
const axios = require('axios');

//get all repos from the api.
router.get('/repos/all/:id', (req, res) => {
  const id = req.params.id;
  User.findOne({ githubusername: id })
    .then((response) => {
      if (response) {
        axios.get(`https://api.github.com/user/repos?${response.githubToken}`, {
          params: {
            affiliation: 'owner',
            sort: 'created'
          }
        })
          .then((data) => {
            const dataGit = [];
            for (i = 0; i < data.data.length; i++) {
              dataGit.push({
                name: data.data[i].name,
                url: data.data[i].html_url,
                description: data.data[i].description,
                private: data.data[i].private,
                cloneUrl: data.data[i].clone_url,
              })
            }
            const dataSend = {
              success: true,
              data: dataGit,
              repoCount: data.data.length
            }
            res.send(dataSend);
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));

});


module.exports = router;