const express = require('express');
const foodCtrl = require('../controllers/food');
const router = express.Router();
const authMiddleware = require('../utils/auth-middleware');

router.get('', authMiddleware.verifyToken, foodCtrl.getFood);
router.get('/:id', authMiddleware.verifyToken, foodCtrl.getFoodById);

module.exports = router;