import express from 'express';
import * as mealsCtrl from '../controllers/meals.js';
import * as authMiddleware from '../utils/auth-middleware.js';

const router = express.Router();

router.get('', authMiddleware.verifyToken, mealsCtrl.getMeals);
router.get('/:id', authMiddleware.verifyToken, mealsCtrl.getMealById);

export default router;
