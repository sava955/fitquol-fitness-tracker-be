import express from 'express';
import * as recipesCtrl from '../controllers/recipes.js';
import * as authMiddleware from '../utils/auth-middleware.js';
import { upload } from '../utils/image-upload.js';

const router = express.Router();

router.get('', authMiddleware.verifyToken, recipesCtrl.getRecipes);
router.get('/:id', authMiddleware.verifyToken, recipesCtrl.getRecipeById);
router.post('', authMiddleware.verifyToken, upload.single("image"), recipesCtrl.createRecipe);
router.patch('/:id', authMiddleware.verifyToken, upload.single("image"), recipesCtrl.updateRecipe);
router.delete('/:id', authMiddleware.verifyToken, recipesCtrl.deleteRecipe);

export default router;
