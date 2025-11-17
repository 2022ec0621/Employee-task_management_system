import React, { createContext, useEffect, useState } from "react";
import * as api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(api.getUserFromStorage());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // validate token by calling /auth/me when token exists and user not loaded
    const token = api.getToken();
    if (token && !user) {
      (async () => {
        try {
          const me = await api.me();
          setUser(me);
          localStorage.setItem("user", JSON.stringify(me));
        } catch (err) {
          api.clearToken();
          setUser(null);
        }
      })();
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      api.persistAuth(res);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.register({ name, email, password });
      api.persistAuth(res);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
