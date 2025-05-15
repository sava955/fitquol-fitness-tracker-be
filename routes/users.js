const express = require('express');
const usersCtrl = require('../controllers/users');
const authMiddleware = require('../utils/auth-middleware');

const router = express.Router();

router.get('/current-user', authMiddleware.verifyToken, usersCtrl.getCurrentUser);
router.patch('/:id', authMiddleware.verifyToken, usersCtrl.updateUser);
router.patch('/password/:id', authMiddleware.verifyToken, usersCtrl.updatePassword);

module.exports = router;
