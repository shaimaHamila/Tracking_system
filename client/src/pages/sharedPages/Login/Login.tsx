import { useMutation } from "@tanstack/react-query";
import { LoginForm } from "../../../components/templates/forms/LoginForm/LoginForm";
import "./Auth.scss";
import api from "../../../api/AxiosConfig";
import axios from "axios";
const Login = () => {
  const { mutate, isPending, isError, error, data } = useMutation({
    mutationFn: (loginData) => axios.post("http://localhost:6001/api/v1/auth/login", loginData).then((res) => res.data),
  });
  const handleLogin = (loginData: any) => {
    mutate(loginData);
  };

  return (
    <div className='auth-page'>
      <img className='auth-page--image' src='./png/loginImage.png' alt='login Image' />
      <div className='auth-page--content'>
        <div className='auth-page--form'>
          <LoginForm loading={isPending} onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
