import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ForgotPassword from "../pages/ForgetPassword/ForgetPassword";

export const usePublicRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
};
