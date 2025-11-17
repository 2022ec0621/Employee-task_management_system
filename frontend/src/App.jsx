import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Layout/Header";
import EmployeeList from "./components/Employees/EmployeesList";

import EmployeeForm from "./components/Employees/EmployeeForm";
import TaskList from "./components/Tasks/TaskList";
import TaskForm from "./components/Tasks/TaskForm";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50  text-slate-900 ">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/employees" />} />

          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/edit/:id" element={<EmployeeForm />} />

          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/edit/:id" element={<TaskForm />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}
