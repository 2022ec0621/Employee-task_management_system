import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";



export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="bg-white  border-b border-slate-200 ">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link
          to="/"
          className="text-xl font-bold text-sky-700 "
        >
          Employee Task Manager
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/employees"
            className="text-slate-700  hover:text-sky-600"
          >
            Employees
          </Link>

          <Link
            to="/tasks"
            className="text-slate-700  hover:text-sky-600"
          >
            Tasks
          </Link>

          

          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 bg-sky-600 text-white rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 border border-sky-500 text-sky-600 rounded"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
