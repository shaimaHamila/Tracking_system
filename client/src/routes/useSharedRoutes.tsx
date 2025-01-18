import { Route } from "react-router-dom";
import MyProfile from "../pages/MyProfile/MyProfile";
import Tickets from "../pages/Tickets/Tickets";
import Projects from "../pages/Projects/Projects";
import Dashboard from "../pages/Dashboard/Dashboard";

const useSharedRoutes = () => {
  // to implement nested routes with the new approch , check useUserRoutes
  // to implement nested routes with the new approch ,
  return (
    <>
      <Route path='/shared' element={<div>shared </div>} />
      <Route path='/shared-route' element={<div>shared route </div>} />
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='projects' element={<Projects />} />
      <Route path='tickets' element={<Tickets />} />
      <Route path='profile' element={<MyProfile />} />
    </>
  );
};
export default useSharedRoutes;
