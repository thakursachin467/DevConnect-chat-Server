const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const auth = require('./api/routes/auth');
const rooms = require('./api/routes/rooms');
const github = require('./api/routes/github');
const cors = require('cors');
const Sentry = require('@sentry/node');
const port = process.env.PORT || 5000;

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

//DB config
const db = require('./Config/keys').mongoURI;
//connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('database connected'))
  .catch((err) => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require('./Config/passport')(passport);

//sentry for error capturing

const dsn=process.env.SENTRY_URI;
Sentry.init({ dsn:dsn});

app.get('*',(req,res)=>{

});

//API ROUTES 
app.use('/api/auth', auth);
app.use('/api/room', rooms);
app.use('/api/github', github);

//YOU CAN CREATE MORE API ROUTES HERE

app.listen(port, () => console.log(`Server Started at port ${port}`));