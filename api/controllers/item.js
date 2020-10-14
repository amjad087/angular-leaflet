const Item = require('../models/item');

exports.createItem = (req, res, next) => {
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
}

exports.getItems = (req, res, next) => {
  Item.find().then(items => {
    res.status(201).json({
      items: items
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Could not get items!'
    });
  })
}
