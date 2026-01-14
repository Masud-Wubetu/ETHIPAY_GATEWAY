// src/auth/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import api from "../api/axios";
import {jwtDecode} from "jwt-decode"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access");
    return token ? { token, ...jwtDecode(token) } : null;
  });

  const login = async (data) => {
    try {
      const res = await api.post("user/login/", data); // login endpoint
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

       // store token and payload
      setUser({ token: res.data.access, ...jwtDecode(res.data.access) });
      return true;
    } catch (error) {
      console.error("Login failed", error.resonse?.data);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
