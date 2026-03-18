const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// View balance
router.get("/balance", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ balance: user.balance });
});

// Deposit money
router.post("/deposit", auth, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.user);
  user.balance += amount;
  await user.save();

  res.json({ message: "Deposited", balance: user.balance });
});

module.exports = router;