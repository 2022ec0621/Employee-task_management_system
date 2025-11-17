const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Get all tasks
// backend/routes/tasks.js (replace the GET '/' handler)
router.get("/", async (req, res, next) => {
  try {
    // Accept query params: assigned_to (uuid), status (todo|in_progress|done), search (title)
    const { assigned_to, status, search } = req.query;

    // Build dynamic WHERE clauses
    const where = [];
    const params = [];

    if (assigned_to) {
      params.push(assigned_to);
      where.push(`t.assigned_to = $${params.length}`);
    }

    if (status) {
      params.push(status);
      where.push(`t.status = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      where.push(`t.title ILIKE $${params.length}`);
    }

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sql = `
      SELECT t.*, e.name AS employee_name
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      ${whereSQL}
      ORDER BY t.due_date ASC NULLS LAST, t.created_at DESC
    `;

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get one task
router.get("/:id", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM tasks WHERE id=$1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Create task
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { title, description, status, assigned_to, due_date } = req.body;

   const result = await db.query(
     `INSERT INTO tasks (title, description, status, assigned_to, due_date)
   VALUES ($1, $2, $3, NULLIF($4, '')::uuid, $5)
   RETURNING *`,
     [title, description, status, assigned_to, due_date]
   );


    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update task
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { title, description, status, assigned_to, due_date } = req.body;

    const result = await db.query(
      `UPDATE tasks SET title=$1,description=$2,status=$3,assigned_to=$4,due_date=$5
       WHERE id=$6 RETURNING *`,
      [title, description, status, assigned_to, due_date, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Delete task
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await db.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
