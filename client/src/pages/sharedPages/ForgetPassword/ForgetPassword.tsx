import { Button, Form, Input, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [resetReqPsw, setResetReqPsw] = useState({ email: "" });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetReqPsw({ ...resetReqPsw, [field]: event.target.value });
  };
  const handleResetPasswordReq = (data: any) => {};

  return (
    <div className='auth-page'>
      <img className='auth-page--image' src='./png/loginImage.png' alt='' />
      <div className='auth-page--form'>
        <div className='auth-form'>
          <div className='auth-form--logo-container'>
            <img className='auth-form--logo' src='./png/logo-light.png' alt='Astrolab Logo' />
          </div>
          <Title className='auth-form--title' level={3}>
            {"Forgot your password ?"}
          </Title>
          <div className='auth-form--title-sub'>
            Veuillez entrer votre adresse e-mail. Vous recevrez un lien vers créez un nouveau mot de passe par e-mail.
          </div>
          <Form onFinish={handleResetPasswordReq} style={{ marginTop: "1rem" }} layout='vertical' size='large'>
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
                id='email'
                placeholder='example@company.com'
                onChange={handleChange("email")}
                value={resetReqPsw.email}
                type='email'
              />
            </Form.Item>

            <Button
              className='auth-form--submit-btn'
              block
              htmlType='submit'
              type='primary'
              shape='round'
              size={"large"}
            >
              {"Reset password"}
            </Button>
          </Form>
          <Typography.Text className='auth-form--text'>
            {"Remember your password?"}{" "}
            <Typography.Link className='auth-form--textLink' onClick={() => navigate("/login")}>
              {"Log in"}
            </Typography.Link>
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
