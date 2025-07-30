
import React, { createContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export const AdminContextApi = createContext();

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [token, setTokenState] = useState(() => {
    return (
      localStorage.getItem("token") || sessionStorage.getItem("token") || ""
    );
  });

  const [user, setUserState] = useState(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  
  const login = (token, user, remember = false) => {
    setTokenState(token);
    setUserState(user);

    if (remember) {
      // Persist in localStorage for long-term storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Clear session storage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Reset state
      setTokenState("");
      setUserState(null);

      toast.success("Logged out successfully");
      navigate("/admin-login");
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login, 
      logout,
      backendUrl,
      currency: "$",
    }),
    [token, user, backendUrl]
  );

  return (
    <AdminContextApi.Provider value={value}>
      {children}
    </AdminContextApi.Provider>
  );
};

 export default AdminContextProvider;