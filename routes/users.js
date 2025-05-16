import express from 'express';
import * as usersCtrl from '../controllers/users.js';
import * as authMiddleware from '../utils/auth-middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "Users root endpoint works!" });
  });

router.get('/current-user', authMiddleware.verifyToken, usersCtrl.getCurrentUser);
router.patch('/:id', authMiddleware.verifyToken, usersCtrl.updateUser);
router.patch('/password/:id', authMiddleware.verifyToken, usersCtrl.updatePassword);

export default router;