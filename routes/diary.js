const express = require('express');
const diaryCtrl = require('../controllers/diary');
const router = express.Router();
const authMiddleware = require('../utils/auth-middleware');

router.get('', authMiddleware.verifyToken, diaryCtrl.getDaiaryByDay);
router.post('/meal', authMiddleware.verifyToken, diaryCtrl.addMealToDiary);
router.post('/exercise', authMiddleware.verifyToken, diaryCtrl.addExerciseToDiary);
router.patch('/meal/:id', authMiddleware.verifyToken, diaryCtrl.updateDiaryMeal);
router.patch('/exercise/:id', authMiddleware.verifyToken, diaryCtrl.updateDiaryExercise);
router.delete('/meal/:id', authMiddleware.verifyToken, diaryCtrl.deleteDiaryMeal);
router.delete('/exercise/:id', authMiddleware.verifyToken, diaryCtrl.deleteDiaryExercise);

module.exports = router;