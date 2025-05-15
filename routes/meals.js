const express = require('express');
const mealsCtrl = require('../controllers/meals');
const router = express.Router();
const authMiddleware = require('../utils/auth-middleware');

router.get('', authMiddleware.verifyToken, mealsCtrl.getMeals);
router.get('/:id', authMiddleware.verifyToken, mealsCtrl.getMealById);

module.exports = router;