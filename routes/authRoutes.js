const express = require("express");
const { login } = require("../authController");
const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

module.exports = router;
