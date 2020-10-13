const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');

const users = require('./routes/users');

const app = express();

//Connect to mongo database
mongoose.connect('mongodb://localhost/khalid', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("Connected to the database");
})
.catch(err => {
  console.log("Error occured in connecting to the database " + err);
})

app.use(cors()); // using cors for cross origin resource sharing, since both angular and node js are running on different domains

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

//user routes
app.use('/api/users', users);

module.exports = app;
