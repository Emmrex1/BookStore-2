import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login/login";
import ProfileSettings from "./setting/Profile/profile";
import ChangePasswordModal from "./setting/Profile/ChangePassword/ChangePassword";
import { Toaster } from "sonner";
import ProtectedRoute from "./routes/ProtectedAdminRoute";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-login" />} />
        <Route path="/admin-login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
            <DashboardLayout/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
             <ProtectedRoute>
            <ChangePasswordModal />
              </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster richColors position="top-right" />
    </main>
  );
};

export default App;
