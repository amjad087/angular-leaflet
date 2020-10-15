const express = require('express');
const router = express.Router();

const Item = require('../models/item');
const checkAuth = require('../middleware/check-auth');

router.post('/create', checkAuth, (req, res, next) => {
  cordArry = [];
  cordArry.push(77.23);
  cordArry.push(24.23);
  const item = new Item({
    subject: req.body.subject,
    body: req.body.body,
    category: req.body.category,
    created_by: req.userData.userId,
    "loc": {
      "type": "Point",
      "coordinates": cordArry
    }
  });

  item.save()
    .then(result => {
      //User created, send the response to frontend
      res.status(201).json({
        message: 'Item Created Successfully!',
        result: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Item could not be saved!'
      });
    });
});
module.exports = router;
