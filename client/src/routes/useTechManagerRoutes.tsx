import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../pages/MainLayout/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import useSharedRoutes from "./useSharedRoutes";
import Equipments from "../pages/Equipments/Equipments";
import TechManagerDashboard from "../pages/TechManagerDashboard/TechManagerDashboard";

// to implement nested routes with the new approch , check useUserRoutes
const useTechManagerRoutes = () => {
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
        <Route path='dashboard' element={<TechManagerDashboard />} />
        <Route path='equipments' element={<Equipments />} />

        {/* Add more nested routes here if needed */}
        {sharedRoutes}
      </Route>
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
export default useTechManagerRoutes;
