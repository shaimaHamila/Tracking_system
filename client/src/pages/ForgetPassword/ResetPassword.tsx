import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const resetPasswordToken = searchParams.get("token");
  useEffect(() => {
    // Check if reset password token is missing and redirect to login if needed
    if (!resetPasswordToken) {
      navigate("/login");
    }
  }, [resetPasswordToken, navigate]);

  const [resetPsw, setResetPsw] = useState({ newPassword: "", confirmNewPassword: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confPasswordVisible, setConfPasswordVisible] = useState(false);

  const handleChange = (filed: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetPsw({ ...resetPsw, [filed]: event.target.value });
  };

  const handleSubmit = () => {
    const data: any = {
      newPassword: resetPsw.newPassword,
      resetPasswordToken: resetPasswordToken!,
    };
    console.log(data);
    // store.dispatch(resetPassword(data));
  };

  return (
    <div className='auth-page'>
      <img className='auth-page--image' src='./png/loginImage.png' alt='login Image' />
      <div className='auth-page--form'>
        <div className='auth-form'>
          <img className='auth-form--logo' src='./png/logo-light.png' alt='astrolab Logo' />
          <Title className='auth-form--title' level={3}>
            Changez votre mot de passe
          </Title>
          <div className='auth-form--title-sub'>
            Veuillez saisir votre nouveau mot de passe et le confirmer ci-dessous.
          </div>

          <Form onFinish={handleSubmit} style={{ marginTop: "1rem" }} layout='vertical' size='large'>
            <Form.Item
              label='Mot de passe'
              name='password'
              rules={[
                {
                  required: true,
                  message: "Veuillez tapez votre mot de passe",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                id='newPassword'
                placeholder='Tapez votre mot de passe'
                onChange={handleChange("newPassword")}
                value={resetPsw.newPassword}
                type='password'
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
              />
            </Form.Item>
            <Form.Item
              label='Confirmer le mot de passe'
              name='confirmPassword'
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("The entered passwords do not match.");
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                id='confirmNewPassword'
                placeholder='Confirmer le mot de passe'
                onChange={handleChange("confirmNewPassword")}
                value={resetPsw.confirmNewPassword}
                type='password'
                visibilityToggle={{ visible: confPasswordVisible, onVisibleChange: setConfPasswordVisible }}
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
              Confirmer le mot de passe
            </Button>
          </Form>
          <Typography.Text className='auth-form--text'>
            Vous vous souvenez de votre mot de passe ?{" "}
            <Typography.Link
              className='auth-form--textLink'
              onClick={() => {
                navigate("/login");
              }}
            >
              Se connecter
            </Typography.Link>
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
