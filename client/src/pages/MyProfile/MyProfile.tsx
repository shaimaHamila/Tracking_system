import React, { useState } from "react";
import { Avatar, Button, Card, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./MyProfile.scss";
const MyProfile: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleFormSubmit = (values: any) => {
    // mutateProfile(values);
  };

  const handleChangePsw = (values: any) => {
    // mutatePassword(values);
  };

  // Custom phone number validation
  const validatePhone = (_: any, value: string) => {
    if (!value || /^[0-9]+$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid phone number."));
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "6px" }}>
      <div className='profile-container'>
        <Card title='Profile Details'>
          <Form form={profileForm} layout='vertical' onFinish={handleFormSubmit}>
            <div className='profile-details'>
              <div className='profile-details-image'>
                <Avatar size={94} icon={<UserOutlined />} />
              </div>
              <div style={{ flex: "1" }} className='test'>
                <Form.Item label='First Name' name='firstName'>
                  <Input id='firstName' placeholder='Enter your first name' type='text' />
                </Form.Item>

                <Form.Item label='Email' name='email'>
                  <Input id='email' placeholder='Enter your email' type='text' />
                </Form.Item>
              </div>
              <div style={{ flex: "1" }} className='test'>
                <Form.Item label='Last Name' name='lastName'>
                  <Input id='lastName' placeholder='Enter your last name' type='text' />
                </Form.Item>
                <Form.Item label='Phone Number' name='phone' rules={[{ validator: validatePhone }]} hasFeedback>
                  <Input id='phone' placeholder='Enter your phone number' type='text' />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "end", marginTop: "1rem" }}>
              <Button onClick={() => profileForm.resetFields()} variant='outlined' size='middle'>
                Cancel
              </Button>
              <Button htmlType='submit' color='primary' variant='outlined' loading={false} size='middle'>
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>

        <Card title='Reset Password'>
          <Form form={passwordForm} layout='vertical' size='large' onFinish={handleChangePsw}>
            <div className='profile-container-psw'>
              <Form.Item
                className='profile-form--row-item'
                label='Password'
                name='password'
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
                hasFeedback
              >
                <Input.Password
                  id='password'
                  placeholder='Enter your new password'
                  type='password'
                  visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                />
              </Form.Item>

              <Form.Item
                className='profile-form--row-item'
                label='Confirm Password'
                name='confirmPassword'
                rules={[
                  { required: true, message: "Confirm Password is required" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Passwords do not match");
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password id='confirmPassword' placeholder='Confirm your new password' type='password' />
              </Form.Item>
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "end", marginTop: "1rem" }}>
              <Button size='middle' onClick={() => passwordForm.resetFields()}>
                Cancel
              </Button>
              <Button size='middle' htmlType='submit' color='primary' loading={false} variant='outlined'>
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default MyProfile;
