import express from 'express';
import * as foodCtrl from '../controllers/food.js';
import * as authMiddleware from '../utils/auth-middleware.js';

const router = express.Router();

router.get('', authMiddleware.verifyToken, foodCtrl.getFood);
router.get('/:id', authMiddleware.verifyToken, foodCtrl.getFoodById);

export default router;