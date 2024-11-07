import { Navigate, Route, BrowserRouter as Router } from "react-router-dom";
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
  const token = localStorage.getItem("accessToken");

  // Fetch current user data
  const {
    isLoading,
    data: currentUser,
    error,
  } = useQuery({
    queryKey: ["user/current-user"],
    queryFn: async () => {
      const response = await api.get("/user/current-user");
      return response.data.data;
    },
    enabled: !!token,
  });
  console.log("Loading", isLoading);

  if (error) {
    localStorage.removeItem("accessToken");
    console.error("Error fetching current user:", error);
  }

  const publicRoutes = usePublicRoutes();
  const adminRoutes = useAdminRoutes();
  const staffRoutes = useStaffRoutes();
  const clientRoutes = useClientRoutes();
  const techManagerRoutes = useTechManagerRoutes();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Router>
          {!currentUser || !token ? (
            publicRoutes
          ) : currentUser.role.id === RolesId.ADMIN ? (
            adminRoutes
          ) : currentUser.role.id === RolesId.STAFF ? (
            staffRoutes
          ) : currentUser.role.id === RolesId.CLIENT ? (
            clientRoutes
          ) : currentUser.role.id === RolesId.TECHNICAL_MANAGER ? (
            techManagerRoutes
          ) : (
            <Route path='*' element={<Navigate to='/not-found' />} />
          )}
        </Router>
      )}
    </>
  );
}

export default App;
