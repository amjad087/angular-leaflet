const express = require('express');
const router = express.Router();

const Item = require('../models/item');
const checkAuth = require('../middleware/check-auth');

const itemController = require('../controllers/item');

router.post('/create', checkAuth, itemController.createItem);
router.get('/', checkAuth, itemController.getItems);
module.exports = router;
