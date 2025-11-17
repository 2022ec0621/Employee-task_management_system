import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask, updateTask, getTask, getEmployees } from "../../api";

export default function TaskForm() {
  const { id } = useParams();
  const nav = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    assigned_to: "",
    due_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      try {
        const emps = await getEmployees();
        if (!mounted) return;
        setEmployees(Array.isArray(emps) ? emps : []);
        if (id) {
          const t = await getTask(id);
          if (!mounted) return;
          setForm({
            title: t?.title || "",
            description: t?.description || "",
            status: t?.status || "todo",
            assigned_to: t?.assigned_to || "",
            due_date: t?.due_date || "",
          });
        }
      } catch (err) {
        console.error("Failed to load form data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [id]);

  const change = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title?.trim()) return alert("Title is required");

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description ? form.description : null,
        status: form.status || "todo",
        assigned_to: form.assigned_to ? form.assigned_to : null,
        due_date: form.due_date ? form.due_date : null,
      };

      if (id) await updateTask(id, payload);
      else await createTask(payload);

      nav("/tasks");
    } catch (err) {
      console.error("Save error", err);
      alert(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white  p-6 rounded shadow-sm">
          <p className="text-slate-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 ">
        {id ? "Edit" : "New"} Task
      </h2>

      <form
        onSubmit={submit}
        className="bg-white  p-6 rounded shadow-sm space-y-4"
      >
        <label className="block">
          <div className="text-sm font-medium text-slate-70 mb-1">
            Title
          </div>
          <input
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
            className="w-full border border-slate-200  bg-white  text-slate-900  rounded px-3 py-2"
            placeholder="Task title"
            required
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium text-slate-700  mb-1">
            Description
          </div>
          <textarea
            value={form.description}
            onChange={(e) => change("description", e.target.value)}
            className="w-full border border-slate-200  bg-white  text-slate-900  rounded px-3 py-2"
            rows={4}
            placeholder="Optional description"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm font-medium text-slate-700  mb-1">
              Status
            </div>
            <select
              value={form.status}
              onChange={(e) => change("status", e.target.value)}
              className="w-full border border-slate-200  bg-white  text-slate-900  rounded px-3 py-2"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700  mb-1">
              Assign to
            </div>
            <select
              value={form.assigned_to || ""}
              onChange={(e) => change("assigned_to", e.target.value || "")}
              className="w-full border border-slate-200  bg-white  text-slate-900  rounded px-3 py-2"
            >
              <option value="">Unassigned</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                  {emp.role ? ` — ${emp.role}` : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <div className="text-sm font-medium text-slate-700  mb-1">
            Due date
          </div>
          <input
            type="date"
            value={form.due_date || ""}
            onChange={(e) => change("due_date", e.target.value)}
            className="w-full border border-slate-200  bg-white text-slate-900  rounded px-3 py-2"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => nav(-1)}
            className="px-4 py-2 border border-slate-200  rounded text-slate-700 "
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
