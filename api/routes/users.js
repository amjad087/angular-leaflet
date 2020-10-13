const express = require('express');
const bcrypt = require('bcrypt'); // for hashing passwords
const router = express.Router();
const User = require('../models/user'); // user shcema

/* GET users listing. */
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
      res.status(201).json({
        message: 'User Created Successfully!',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });
});

module.exports = router;
