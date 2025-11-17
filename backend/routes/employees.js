const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Get all employees
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM employees ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get one employee
router.get("/:id", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM employees WHERE id=$1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Create employee (protected)
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const result = await db.query(
      `INSERT INTO employees (name, email, role)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [name, email, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update employee
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const result = await db.query(
      `UPDATE employees SET name=$1,email=$2,role=$3
       WHERE id=$4 RETURNING *`,
      [name, email, role, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Delete employee
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await db.query("DELETE FROM employees WHERE id=$1", [req.params.id]);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
