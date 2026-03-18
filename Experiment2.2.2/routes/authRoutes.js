const express = require("express");
const router = express.Router();
const { register, login, refreshToken } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/refresh", auth, refreshToken);

router.post("/register", register);
router.post("/login", login);

module.exports = router;