const express = require('express');
const bcrypt = require('bcrypt'); // for hashing passwords
const router = express.Router();
const User = require('../models/user'); // user shcema
const jwt = require('jsonwebtoken');

/* GET users listing. */

// ------------------------------------------------------------------------------
//Signup end point
router.post('/signup', (req, res, next) => {
  //generating hashed password
  bcrypt.hash(req.body.password, 10).then(hashedPassword => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    user.save()
    .then(result => {
      //User created, send the response to frontend
      res.status(201).json({
        message: 'User Created Successfully!',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Duplicate username or email!'
      });
    });
  });
});

// ------------------------------------------------------------------------------
// login end point
router.post('/login', (req, res, next) => {
  let fetchedUser;
  //first verify username or email (user can be logged in with both username and email)
  User.findOne().or([{ username: req.body.usernameEmail }, { email: req.body.usernameEmail }])
  .then(user => {
    if(!user) { // if user not found
      return res.status(401).json({
        message: 'Invalid username/email or password'
      });
    }
    fetchedUser = user;
    //user found now compare the password
    return bcrypt.compare(req.body.password, user.password); // chain the promise
  })
  .then(result => { // chained promise
    if(!result) {  // if password does not match
      return res.status(401).json({
        message: 'Invalid username/email or password'
      });
    }

    //password matches, now create a token (for authorization)
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id, username: fetchedUser.username },
      'My_super_large_secret_string',
      { expiresIn: '1h' } // this token will expire in 1 hour
    );
    const response = {
      message: 'user logged in',
      userId: fetchedUser._id,
      token: token,
      expiresIn: 3600 // in seconds = 1 hr
    }

    //user authenticated, now send the response to frontend
    res.status(200).json({
      loginData: response
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Auth failed'
    });
  });
});

module.exports = router;
