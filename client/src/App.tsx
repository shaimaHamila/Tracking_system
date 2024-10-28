import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgetPassword/ForgetPassword";
import MainLayout from "./pages/MainLayout/MainLayout";
import Projects from "./pages/Projects/Projects";
import Tickets from "./pages/Tickets/Tickets";
import Equipments from "./pages/Equipments/Equipments";
import Users from "./pages/Users/Users";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
function App() {
  console.log(import.meta.env.VITE_ENVIRONMENT);
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/' element={<MainLayout />}>
          <Route path='users' element={<Users />} />
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='projects' element={<Projects />} />
          <Route path='tickets' element={<Tickets />} />
          <Route path='equipments' element={<Equipments />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
