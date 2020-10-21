const Item = require('../models/item');

exports.createItem = (req, res, next) => {
  let detectedLoc = [];
  detectedLoc.push(req.body.detectedLoc.lng);
  detectedLoc.push(req.body.detectedLoc.lat);

  let providedLoc = [];
  providedLoc.push(req.body.providedLoc.lng);
  providedLoc.push(req.body.providedLoc.lat);
  const item = new Item({
    subject: req.body.subject,
    body: req.body.body,
    category: req.body.category,
    created_by: req.userData.username,
    "detected_loc": {
      "type": "Point",
      "coordinates": detectedLoc
    },
    "provided_loc": {
      "type": "Point",
      "coordinates": providedLoc
    },
    location: req.body.location
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

exports.getOldestItem = (req, res, next) => {
  console.log('get oldest item');
  Item.find({ 'created_by': req.userData.username}).sort({created_at:1}).limit(1).then(items => {
    res.status(201).json({
      message: 'Items got successfully',
      created_at: items
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Could not get items!'
    });
  });
}

// get items based on category (A, B)
exports.getCategoryItems = (req, res, next) => {
  Item.find({ 'category': req.params.category, 'created_by': req.userData.username }).sort({created_at:-1}).then(items => {
    res.status(201).json({
      message: 'Items got successfully',
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

// get all items regardless of category
exports.getAllItems = (req, res, next) => {
  Item.find({ 'created_by': req.userData.username}).then(items => {
    res.status(201).json({
      message: 'Items got successfully',
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


