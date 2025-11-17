import React, { useEffect, useState } from "react";
import { createEmployee, getEmployee, updateEmployee } from "../../api";
import { useParams, useNavigate } from "react-router-dom";

export default function EmployeeForm() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getEmployee(id)
        .then((emp) => {
          setForm({
            name: emp.name,
            email: emp.email,
            role: emp.role,
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const change = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateEmployee(id, form);
      } else {
        await createEmployee(form);
      }
      nav("/employees");
    } catch (err) {
      alert(err?.message || "Save failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">
        {id ? "Edit Employee" : "New Employee"}
      </h2>

      <form
        onSubmit={save}
        className="bg-white  p-6 rounded shadow space-y-4"
      >
        <label className="block">
          <div>Name</div>
          <input
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </label>

        <label className="block">
          <div>Email</div>
          <input
            value={form.email}
            onChange={(e) => change("email", e.target.value)}
            type="email"
            className="w-full border px-3 py-2 rounded "
            required
          />
        </label>

        <label className="block">
          <div>Role</div>
          <input
            value={form.role}
            onChange={(e) => change("role", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </label>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-sky-600 text-white rounded"
            type="submit"
          >
            Save
          </button>

          <button
            onClick={() => nav(-1)}
            type="button"
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
