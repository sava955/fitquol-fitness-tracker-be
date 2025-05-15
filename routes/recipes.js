const express = require('express');
const recipesCtrl = require('../controllers/recipes');
const router = express.Router();
const authMiddleware = require('../utils/auth-middleware');
const { upload } = require("../utils/image-upload");

router.get('', authMiddleware.verifyToken, recipesCtrl.getRecipes);
router.get('/:id', authMiddleware.verifyToken, recipesCtrl.getRecipeById);
router.post('', authMiddleware.verifyToken, upload.single("image"), recipesCtrl.createRecipe);
router.patch('/:id', authMiddleware.verifyToken, upload.single("image"), recipesCtrl.updateRecipe);
router.delete('/:id', authMiddleware.verifyToken, recipesCtrl.deleteRecipe);

module.exports = router;