// backend/index.js
import express from "express";
import cors from "cors";
import path from "node:path";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // parses application/json

// --- API routes (mount before static/catch-all) ---
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);

// Optional health check or root API route
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "Employee Task Management API" })
);

// --- Static frontend serving (if you built the frontend) ---
// Resolve project root and point to frontend build
const __dirname = path.resolve();
const clientDist = path.join(__dirname, "frontend", "dist");

// serve static assets if folder exists
app.use(express.static(clientDist));

// Catch-all: send index.html for client-side routing
// Use '/*' or '/' (NOT '*')
app.get("/", (req, res, next) => {
  // If it's an API request, skip and let the API routes handle it
  if (req.path.startsWith("/api/")) return next();

  // Otherwise, serve index.html (if exists)
  const indexHtml = path.join(clientDist, "index.html");
  return res.sendFile(indexHtml, (err) => {
    if (err) {
      // If index.html not found, fallback with a small JSON response
      console.warn("index.html not found at", indexHtml);
      return res.status(200).json({ message: "Employee Task Management API" });
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
