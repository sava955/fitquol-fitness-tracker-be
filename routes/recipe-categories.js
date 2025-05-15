import express from 'express';
import * as recipeCategoriesCtrl from '../controllers/recipe-categories.js';
import * as authMiddleware from '../utils/auth-middleware.js';

const router = express.Router();

router.get('', authMiddleware.verifyToken, recipeCategoriesCtrl.getRecipeCategories);

export default router;
