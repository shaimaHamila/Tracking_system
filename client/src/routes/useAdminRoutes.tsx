import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../pages/MainLayout/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import useSharedRoutes from "./useSharedRoutes";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import Equipments from "../pages/Equipments/Equipments";
import Users from "../pages/Users/Users";

// to implement nested routes with the new approch , check useUserRoutes
const useAdminRoutes = () => {
  const sharedRoutes = useSharedRoutes();
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path='users' element={<Users />} />
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='equipments' element={<Equipments />} />

        {/* Add more nested routes here if needed */}
      </Route>
      {sharedRoutes}
      <Route
        path='*'
        element={
          <ProtectedRoute>
            <Navigate replace to='/dashboard' />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
export default useAdminRoutes;
