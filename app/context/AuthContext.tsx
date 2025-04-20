"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post("${apiUrl}/auth/login", {
      username,
      password,
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
    }
    setToken(res.data.token);
    setRole(res.data.role);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setToken(null);
    setRole(null);
  };

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
