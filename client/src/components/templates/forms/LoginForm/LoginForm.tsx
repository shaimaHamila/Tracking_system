import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import "./AuthForm.scss";
interface LoginFormProps {
  onLogin: (login: { email: string; password: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [field]: event.target.value });
  };
  const handleSubmit = () => {
    onLogin(login);
  };
  return (
    <div className='auth-form'>
      <div className='auth-form--logo-container'>
        <img className='auth-form--logo' src='./png/logo-light.png' alt='Astrolab Logo' />
      </div>

      <Title className='auth-form--title' level={3}>
        {"Log in"}
      </Title>

      <Form onFinish={handleSubmit} style={{ marginTop: "1rem" }} layout='vertical' size='large'>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: "Please enter your email.",
            },
            { type: "email", message: "Please enter a valid email." },
          ]}
          hasFeedback
        >
          <Input
            id='loginEmail'
            placeholder='example@company.com'
            onChange={handleChange("email")}
            value={login.email}
            type='text'
          />
        </Form.Item>
        <Form.Item
          label={"Password"}
          name='password'
          rules={[
            {
              required: true,
              message: "Enter your password",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            id='password'
            placeholder={"Enter your password"}
            onChange={handleChange("password")}
            value={login.password}
            type='password'
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
        </Form.Item>

        <div className='auth-form--forgot-psw'>
          <Link className='auth-form--forgot-psw-link' onClick={() => navigate("/forgot-password")}>
            {"Forgot your password ?"}
          </Link>
        </div>
        <Button className='auth-form--submit-btn' block htmlType='submit' type='primary' size={"large"}>
          {"Log in"}
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
