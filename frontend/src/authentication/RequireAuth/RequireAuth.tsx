import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) => {
  const role = localStorage.getItem("role");

  // ตรวจสอบว่า role ตรงกับที่อนุญาตหรือไม่
  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
