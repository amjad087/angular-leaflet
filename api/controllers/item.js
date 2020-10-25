const item = require('../models/item');
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
  Item.find({'created_by': req.userData.username}).sort({created_at:1}).limit(1).then(items => {
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
  });
}

exports.getItem = (req, res, next) => {
  Item.findOne({'_id': req.params.itemId}).then(item => {
    res.status(201).json({
      message: 'Items got successfully',
      item: item
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Could not get items!'
    });
  });
}

// Update Item
exports.updateItem = (req, res, nex) => {
  const itemId = req.params.itemId;

  let detectedLoc = [];
  detectedLoc.push(req.body.detectedLoc.lng);
  detectedLoc.push(req.body.detectedLoc.lat);

  let providedLoc = [];
  providedLoc.push(req.body.providedLoc.lng);
  providedLoc.push(req.body.providedLoc.lat);

  const item = {
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
  }

  Item.updateOne({_id: itemId}, item)
  .then(result => {
    //User created, send the response to frontend
    res.status(201).json({
      message: 'Item Updated Successfully!',
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

// delete Item
exports.deleteItem = (req, res, nex) => {
  Item.deleteOne({_id: req.params.itemId, created_by: req.userData.username})
  .then(result => {
    //User created, send the response to frontend
    res.status(201).json({
      message: 'Item deleted Successfully!',
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Item could not be deleted!'
    });
  });
}

// get items based on category (A, B)
exports.getCategoryItems = (req, res, next) => {

  Item.find({ 'category': req.query.category }).sort({created_at:-1}).then(items => {

    let newItems = [];
    for (let item of items) {
      let itemDate = new Date(req.query.itemsDate);
      const itemUtcDate = new Date(itemDate.getUTCFullYear(), itemDate.getUTCMonth(), itemDate.getUTCDate(),  itemDate.getUTCHours(), itemDate.getUTCMinutes(), itemDate.getUTCSeconds());
      let createDate = item.created_at;
      if(createDate.getTime() >= itemUtcDate.getTime()) {
        newItems.push(item);
      }
    }
    res.status(201).json({
      message: 'Items got successfully',
      items: newItems
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


