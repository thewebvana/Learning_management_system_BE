
const express = require("express");
const jwt = require("jsonwebtoken");
const { Signup } = require("../models/index");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { customerName, companyName, address, city, zipcode, phone, email, password } = req.body;

  try {
    const userExists = await Signup.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new Signup({
      customerName,
      companyName,
      address,
      city,
      zipcode,
      phone,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})

router.post("/login", async (req, res) => {
  const { email, password, remember } = req.body;

  try {
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})


module.exports = router
