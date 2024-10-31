import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: any) => {
  const isAuthenticated = localStorage.getItem("accessToken");
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
