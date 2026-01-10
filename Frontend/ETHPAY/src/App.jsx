import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentPage from "./pages/PaymentPage";
import PaymentHistory from "./pages/PaymentHistory";
import AdminDashboard from "./pages/AdminDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import UserDashboard from "./pages/UserDashboard";
import DashboardLayout from "./components/DashboardLayout";

import MainLayout from "./layouts/MainLayout";
import RoleRoute from "./auth/RoleRoute";
import PrivateRoute from './auth/PrivateRoute'

export default function App() {
 
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={< Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route
            path="/payments/new"
            element={
              <PrivateRoute allowedRoles={["CUSTOMER", "MERCHANT"]}>
                <PaymentPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <PaymentHistory />
              </PrivateRoute>
            }
          />

          {/* Admin & Merchant routes */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/merchant"
            element={
              <RoleRoute allowedRoles={["MERCHANT"]}>
                <MerchantDashboard />
              </RoleRoute>
            }
          />
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={["CUSTOMER"]}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
