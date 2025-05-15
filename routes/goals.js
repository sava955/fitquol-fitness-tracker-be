const express = require('express');
const goalsCtrl = require('../controllers/goals');
const authMiddleware = require('../utils/auth-middleware');

const router = express.Router();

router.get('/current-goal', authMiddleware.verifyToken, goalsCtrl.getCurrentGoal);
router.get('', authMiddleware.verifyToken, goalsCtrl.getGoals);

module.exports = router;
