import express from 'express';
import * as dashboardCtrl from '../controllers/dashboard.js';
import * as authMiddleware from '../utils/auth-middleware.js';

const router = express.Router();

router.get('', authMiddleware.verifyToken, dashboardCtrl.getDashboard);
router.get('/calories-statistic', authMiddleware.verifyToken, dashboardCtrl.getCaloriesStatistic);
router.get('/exercises-statistic', authMiddleware.verifyToken, dashboardCtrl.getExercisesStatistic);
router.get('/weight-statistic', authMiddleware.verifyToken, dashboardCtrl.getWeightStatistic);

export default router;
