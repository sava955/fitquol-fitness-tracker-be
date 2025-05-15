import express from 'express';
import * as exercisesCtrl from '../controllers/exercises.js';
import * as authMiddleware from '../utils/auth-middleware.js';

const router = express.Router();

router.get('', authMiddleware.verifyToken, exercisesCtrl.getExercises);
router.get('/:id', authMiddleware.verifyToken, exercisesCtrl.getExerciseById);

export default router;
