import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "user" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role = "user" }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  console.log("ProtectedRoute rendered → token:", token, "storedRole:", storedRole, "expected role:", role);

  // If no token, redirect to signup
  if (!token) {
    console.warn("No token found → redirecting to /signup");
    return <Navigate to="/signup" replace />;
  }

  // If role mismatch (for admin vs user)
  if (storedRole && storedRole !== role) {
    console.warn("Role mismatch → redirecting to home");
    return <Navigate to="/" replace />;
  }

  // ✅ If checks pass → render the actual page
  return <>{children}</>;
};

export default ProtectedRoute;
