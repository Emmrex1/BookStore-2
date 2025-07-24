import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AdminContextApi } from "@/context/api/AdmincontexApi";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AdminContextApi);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
