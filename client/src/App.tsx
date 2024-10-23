import { Route, Routes } from "react-router-dom";
import Login from "./pages/sharedPages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { store } from "./store/store";
import { useEffect } from "react";
import { testStore } from "./features/auth/authSlice";
import ForgotPassword from "./pages/sharedPages/ForgetPassword/ForgetPassword";
function App() {
  useEffect(() => {
    store.dispatch(testStore());
  }, []);
  console.log(import.meta.env.VITE_ENVIRONMENT);
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
