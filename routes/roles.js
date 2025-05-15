import express from 'express';
import Role from '../models/role.js';

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const role = new Role({
      role: req.body.role,
    });
    await role.save();
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    next(error);
  }
});

export default router;

