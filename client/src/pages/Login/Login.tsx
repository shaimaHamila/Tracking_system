import { LoginForm } from "../../components/templates/forms/LoginForm/LoginForm";
import "./Auth.scss";
import { useLogin } from "../../features/auth/AuthHooks";
const Login = () => {
  const { mutate: login, isPending } = useLogin();

  const handleLogin = (credentials: any) => {
    login(credentials);
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
