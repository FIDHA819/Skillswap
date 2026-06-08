import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({
  children,
}: Props) => {

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {

    return <div>Loading...</div>;

  }

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return <>{children}</>;

};