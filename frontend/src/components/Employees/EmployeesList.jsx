import React, { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../../api";
import { useNavigate } from "react-router-dom";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const load = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete employee?")) return;
    try {
      await deleteEmployee(id);
      load();
    } catch (err) {
      alert(err?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Employees</h2>
        <button
          onClick={() => nav("/employees/new")}
          className="px-4 py-2 bg-sky-600 text-white rounded"
        >
          New Employee
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white  rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 ">
            <thead className="bg-slate-50 ">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Name</th>
                <th className="px-4 py-3 text-left text-sm">Email</th>
                <th className="px-4 py-3 text-left text-sm">Role</th>
                <th className="px-4 py-3 text-right text-sm">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 ">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50 "
                  >
                    <td className="px-4 py-3">{emp.name}</td>
                    <td className="px-4 py-3">{emp.email}</td>
                    <td className="px-4 py-3">{emp.role}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => nav(`/employees/edit/${emp.id}`)}
                        className="px-3 py-1 mr-2 border rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => remove(emp.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-4 py-4 text-center text-slate-500"
                    colSpan="4"
                  >
                    No employees found.
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
