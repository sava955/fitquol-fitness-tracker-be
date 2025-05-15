const express = require('express');
const Role = require('../models/role');

const router = express.Router();

router.post('/create', (req, res, next) => {
   const role = new Role({
    role: req.body.role
   });

   role.save();
});

module.exports = router;