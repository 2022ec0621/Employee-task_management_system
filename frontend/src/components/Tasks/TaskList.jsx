// frontend/src/components/tasks/TaskList.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, getEmployees, deleteTask } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

export default function TaskList() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    assigned_to: "",
    status: "",
    search: "",
  });
  const [error, setError] = useState(null);

  // debounce for search input
  const searchRef = useRef(null);

  useEffect(() => {
    // load employees once
    (async () => {
      try {
        const emps = await getEmployees();
        setEmployees(Array.isArray(emps) ? emps : []);
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    })();
  }, []);

  useEffect(() => {
    // load tasks whenever filter changes
    loadTasks(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.assigned_to, filter.status]); // search handled via debounce

  // load tasks helper
  async function loadTasks(q = {}) {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(q);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tasks", err);
      setError(err?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  // handle search with debounce
  const handleSearchChange = (val) => {
    setFilter((p) => ({ ...p, search: val }));
    if (searchRef.current) clearTimeout(searchRef.current);
    // debounce 300ms
    searchRef.current = setTimeout(() => {
      // call API with new search plus other filters
      const q = {};
      if (val) q.search = val;
      if (filter.assigned_to) q.assigned_to = filter.assigned_to;
      if (filter.status) q.status = filter.status;
      loadTasks(q);
    }, 300);
  };

  const applyFiltersNow = () => {
    const q = {};
    if (filter.search) q.search = filter.search;
    if (filter.assigned_to) q.assigned_to = filter.assigned_to;
    if (filter.status) q.status = filter.status;
    loadTasks(q);
  };

  const clearFilters = () => {
    setFilter({ assigned_to: "", status: "", search: "" });
    loadTasks();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete task?")) return;
    try {
      await deleteTask(id);
      // reload
      applyFiltersNow();
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 ">
            Tasks
          </h2>
          <p className="text-sm text-slate-500 ">
            Filter, search, and manage tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search by title..."
            value={filter.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="px-3 py-2 border border-slate-200  bg-white  text-slate-900  rounded w-56"
          />

          <select
            value={filter.assigned_to}
            onChange={(e) =>
              setFilter((p) => ({ ...p, assigned_to: e.target.value }))
            }
            className="border border-slate-200  rounded px-3 py-2 bg-white  text-slate-900 "
          >
            <option value="">All employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <select
            value={filter.status}
            onChange={(e) =>
              setFilter((p) => ({ ...p, status: e.target.value }))
            }
            className="border border-slate-200  rounded px-3 py-2 bg-white  text-slate-900 "
          >
            <option value="">All statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <button
            onClick={applyFiltersNow}
            className="px-3 py-2 border border-slate-200  rounded hover:bg-slate-50 "
          >
            Apply
          </button>

          <button
            onClick={clearFilters}
            className="px-3 py-2 border border-slate-200  rounded hover:bg-slate-50 "
          >
            Clear
          </button>

          <button
            onClick={() => nav("/tasks/new")}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded"
          >
            New Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white  p-6 rounded shadow-sm">
          <p className="text-slate-600 ">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50  p-4 rounded border border-rose-100 ">
          <p className="text-rose-700 ">Error: {error}</p>
          <div className="mt-2">
            <button
              onClick={() => loadTasks()}
              className="px-3 py-1 border rounded bg-white "
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white  shadow rounded overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-slate-50 ">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 ">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 ">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 ">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 ">
                  Due
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 ">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 ">
              {tasks.length > 0 ? (
                tasks.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50 "
                  >
                    <td className="px-4 py-3 text-sm text-slate-700 ">
                      {t.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 ">
                      <span
                        className={
                          t.status === "done"
                            ? "inline-block px-2 py-1 text-xs rounded bg-emerald-100  text-emerald-800 "
                            : t.status === "in_progress"
                            ? "inline-block px-2 py-1 text-xs rounded bg-yellow-100  text-yellow-800 "
                            : "inline-block px-2 py-1 text-xs rounded bg-slate-100  text-slate-700 "
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 ">
                      {t.employee_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 ">
                      {t.due_date || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => nav(`/tasks/edit/${t.id}`)}
                        className="px-3 py-1 mr-2 border border-slate-200  rounded text-slate-700 "
                      >
                        Edit
                      </button>

                      {user ? (
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => nav("/login")}
                          className="px-3 py-1 border rounded text-slate-700 "
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-sm text-slate-600 "
                    colSpan="5"
                  >
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
