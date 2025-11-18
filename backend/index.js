import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "node:path"; 
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import taskRoutes from "./routes/tasks.js";

require("dotenv").config();

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", 'dist', 'index.html'));
})
// API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Employee Task Management API" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
