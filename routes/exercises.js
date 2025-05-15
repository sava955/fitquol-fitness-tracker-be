const express = require('express');
const exercisesCtrl = require('../controllers/exercises');
const authMiddleware = require('../utils/auth-middleware');

const router = express.Router();

router.get('', authMiddleware.verifyToken, exercisesCtrl.getExercises);

router.get('/:id', authMiddleware.verifyToken, exercisesCtrl.getExerciseById);

module.exports = router;
