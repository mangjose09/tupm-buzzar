import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Unauthorized from "./Unauthorized";
const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.includes("vendor") && user.is_vendor) {
    return <Outlet />;
  }

  if (allowedRoles.includes("customer") && !user.is_vendor) {
    return <Outlet />;
  }

  if (allowedRoles.includes("admin") && user.email === "buzzaradmin@example.com") {
    return <Outlet />;
  }

  return <Unauthorized />;
};

export default PrivateRoute;
