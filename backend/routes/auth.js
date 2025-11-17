const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const router = express.Router();

function signToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, email, role`,
      [name, email, hash, role || "user"]
    );

    const user = result.rows[0];

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (result.rows.length === 0)
      return res.status(400).json({ error: "Invalid email" });

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: "Incorrect password" });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    delete user.password_hash;

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

// Logged-in user
router.get("/me", async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Missing token" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await db.query(
      `SELECT id, name, email, role FROM users WHERE id=$1`,
      [decoded.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
