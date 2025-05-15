import express from 'express';
import * as goalsCtrl from '../controllers/goals.js';
import * as authMiddleware from '../utils/auth-middleware.js';

const router = express.Router();

router.get('/current-goal', authMiddleware.verifyToken, goalsCtrl.getCurrentGoal);
router.get('', authMiddleware.verifyToken, goalsCtrl.getGoals);

export default router;
