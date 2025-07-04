import express from "express";
import * as authCtrl from '../controllers/auth.js'; 

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "Auth root endpoint works!" });
  });

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);

export default router;
