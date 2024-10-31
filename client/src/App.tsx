import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Loading } from "./components/atoms/Loading/Loading";
import { usePublicRoutes } from "./routes/usePublicRoutes";
import useAdminRoutes from "./routes/useAdminRoutes";
import useClientRoutes from "./routes/useClientRoutes";
import useTechManagerRoutes from "./routes/useTechManagerRoutes";
import useStaffRoutes from "./routes/useStaffRoutes";
import api from "./api/AxiosConfig";
import { useQuery } from "@tanstack/react-query";
import { RolesId } from "./types/Role";

function App() {
  const token = localStorage.getItem("accessToken"); // Retrieve token from local storage

  // Fetch current user data
  const {
    isLoading,
    data: currentUser,
    error,
  } = useQuery({
    queryKey: ["user/current-user"],
    queryFn: async () => {
      const response = await api.get("/user/current-user");
      return response.data; // Return the user data
    },
    enabled: !!token, // Only fetch current user if token exists
  });

  // Define routes based on roles
  const publicRoutes = usePublicRoutes();
  const adminRoutes = useAdminRoutes();
  const staffRoutes = useStaffRoutes();
  const clientRoutes = useClientRoutes();
  const techManagerRoutes = useTechManagerRoutes();

  // Handle loading and error states
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    // Handle error state (optional)
    console.error("Error fetching current user:", error);
    return <div>Error loading user information.</div>;
  }

  return (
    <Router>
      {!currentUser || !token ? (
        // Render public routes if user is not authenticated
        publicRoutes
      ) : (
        // Render protected routes based on user role
        <Routes>
          {currentUser.role.id === RolesId.ADMIN && adminRoutes}
          {currentUser.role.id === RolesId.STAFF && staffRoutes}
          {currentUser.role.id === RolesId.CLIENT && clientRoutes}
          {currentUser.role.id === RolesId.TECHNICAL_MANAGER && techManagerRoutes}
          <Route path='*' element={<Navigate to='/not-found' />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
