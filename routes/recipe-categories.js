const express = require('express');
const recipeCategoriesCtrl = require('../controllers/recipe-categories');
const router = express.Router();
const authMiddleware = require('../utils/auth-middleware');

router.get('', authMiddleware.verifyToken, recipeCategoriesCtrl.getRecipeCategories);

module.exports = router;