const express = require('express');
const dashboardCtrl = require('../controllers/dashboard');
const router = express.Router();
const authMiddleware = require('../utils/auth-middleware');

router.get('', authMiddleware.verifyToken, dashboardCtrl.getDashboard);

router.get('/calories-statistic', authMiddleware.verifyToken, dashboardCtrl.getCaloriesStatistic);

router.get('/exercises-statistic', authMiddleware.verifyToken, dashboardCtrl.getExercisesStatistic);

router.get('/weight-statistic', authMiddleware.verifyToken, dashboardCtrl.getWeightStatistic);

module.exports = router;