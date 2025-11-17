const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const TOKEN_KEY = "token";
const USER_KEY = "user";

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export function persistAuth({ token, user }) {
  setToken(token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getUserFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  const body =
    text && contentType.includes("application/json")
      ? JSON.parse(text)
      : text
      ? text
      : null;
  if (!res.ok) {
    const msg = (body && (body.error || body.message)) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

// Auth
export const register = (payload) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
export const login = (payload) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
export const me = () => request("/auth/me", { method: "GET" });

// Employees
export const getEmployees = () => request("/employees", { method: "GET" });
export const getEmployee = (id) =>
  request(`/employees/${encodeURIComponent(id)}`, { method: "GET" });
export const createEmployee = (payload) =>
  request("/employees", { method: "POST", body: JSON.stringify(payload) });
export const updateEmployee = (id, payload) =>
  request(`/employees/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deleteEmployee = (id) =>
  request(`/employees/${encodeURIComponent(id)}`, { method: "DELETE" });

// Tasks
export const getTasks = (query = {}) => {
  const qs = new URLSearchParams(query).toString();
  return request(`/tasks${qs ? "?" + qs : ""}`, { method: "GET" });
};
export const getTask = (id) =>
  request(`/tasks/${encodeURIComponent(id)}`, { method: "GET" });
export const createTask = (payload) =>
  request("/tasks", { method: "POST", body: JSON.stringify(payload) });
export const updateTask = (id, payload) =>
  request(`/tasks/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deleteTask = (id) =>
  request(`/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });

export default {
  register,
  login,
  me,
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  setToken,
  getToken,
  clearToken,
  persistAuth,
  getUserFromStorage,
};
