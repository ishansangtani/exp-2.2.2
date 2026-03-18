const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;