const express = require('express');
const router = express.Router();

const Item = require('../models/item');
const checkAuth = require('../middleware/check-auth');

const itemController = require('../controllers/item');

router.post('/create', checkAuth, itemController.createItem);
router.get('/oldest-item/:category', checkAuth, itemController.getOldestItem);
router.get('/item/:itemId', checkAuth, itemController.getItem);
router.get('', checkAuth, itemController.getAllItems);
router.put('/:itemId', checkAuth, itemController.updateItem);
router.get('/category', checkAuth, itemController.getCategoryItems);

module.exports = router;
