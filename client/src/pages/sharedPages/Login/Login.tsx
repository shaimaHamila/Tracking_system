import { LoginForm } from "../../../components/templates/forms/LoginForm/LoginForm";
import "./Auth.scss";
const Login = () => {
  return (
    <div className='auth-page'>
      <div className='auth-page--content'>
        <div className='auth-page--form'>
          <LoginForm onLogin={(data) => console.log(data)} />
        </div>
      </div>
      <img className='auth-page--image' src='./png/loginImage.png' alt='login Image' />
    </div>
  );
};

export default Login;
