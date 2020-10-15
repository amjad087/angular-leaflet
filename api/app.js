const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');

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
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

//user routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

module.exports = app;
