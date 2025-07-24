
import { ShopContext } from "@/context/ShopContext";
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const { token } = useContext(ShopContext);
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;