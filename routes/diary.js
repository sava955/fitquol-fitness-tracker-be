import express from 'express';
import * as diaryCtrl from '../controllers/diary.js';
import * as authMiddleware from '../utils/auth-middleware.js';

const router = express.Router();

router.get('', authMiddleware.verifyToken, diaryCtrl.getDaiaryByDay);
router.post('/meal', authMiddleware.verifyToken, diaryCtrl.addMealToDiary);
router.post('/exercise', authMiddleware.verifyToken, diaryCtrl.addExerciseToDiary);
router.patch('/meal/:id', authMiddleware.verifyToken, diaryCtrl.updateDiaryMeal);
router.patch('/exercise/:id', authMiddleware.verifyToken, diaryCtrl.updateDiaryExercise);
router.delete('/meal/:id', authMiddleware.verifyToken, diaryCtrl.deleteDiaryMeal);
router.delete('/exercise/:id', authMiddleware.verifyToken, diaryCtrl.deleteDiaryExercise);

export default router;
