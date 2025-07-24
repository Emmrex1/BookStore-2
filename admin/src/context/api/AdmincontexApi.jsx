
import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Currency } from "lucide-react";

export const AdminContextApi = createContext();

const AdminContextApiProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const currency = "$"; 

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/logout`, null, {
        withCredentials: true,
      });
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/admin-login");
    } catch (error) {
      setToken(null);
      setUser(null);
      toast.error("You were logged out locally.");
      navigate("/admin-login");
    }
  };

  const value = useMemo(
    () => ({ token, setToken, user, setUser, logout, backendUrl, currency }),
    [token, user]
  );

  return (
    <AdminContextApi.Provider value={value}>
      {children}
    </AdminContextApi.Provider>
  );
};

export default AdminContextApiProvider;
