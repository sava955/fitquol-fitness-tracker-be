import express from "express";
import * as authCtrl from '../controllers/auth.js'; 

const router = express.Router();

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);

// In routes/users.js (or directly in server.js temporarily)
router.get("/", (req, res) => {
    res.json({ message: "Auth endpoint works!" });
  });

export default router;
