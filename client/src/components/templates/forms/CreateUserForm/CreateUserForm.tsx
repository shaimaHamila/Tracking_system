import React from "react";
import "./CreateUserForm.scss";
import { Button, Card, Flex, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { User } from "../../../../types/User";
import { RolesId } from "../../../../types/Role";
const { Option } = Select;

interface CreateUserFormProps {
  onCreateUser: (user: Partial<User>) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreateUser }) => {
  const [userForm] = Form.useForm();

  const handleFormSubmit = (values: Partial<User>) => {
    onCreateUser(values);
    userForm.resetFields();
  };
  return (
    <Form form={userForm} layout='vertical' autoComplete='off' className='user-form' onFinish={handleFormSubmit}>
      <div className='user-form'>
        <Card bordered={false}>
          {/* Basic Fields */}
          <Flex gap={16} wrap>
            <Form.Item
              className='user-form--input'
              label='First Name'
              name='firstName'
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder='Enter first name' />
            </Form.Item>

            <Form.Item
              className='user-form--input'
              label='Last Name'
              name='lastName'
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder='Enter last name' />
            </Form.Item>
          </Flex>
          <Flex gap={16} wrap>
            <Form.Item
              className='user-form--input'
              label='Email'
              name='email'
              rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
            >
              <Input placeholder='Enter email' />
            </Form.Item>
            <Form.Item label='Phone Number' name='phoneNumber' className='user-form--input'>
              <Input placeholder='Enter phone number (optional)' />
            </Form.Item>
          </Flex>
          <Flex gap={16} wrap>
            <Form.Item
              className='user-form--input'
              label='Password'
              name='password'
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder='Enter password' />
            </Form.Item>

            <Form.Item
              className='user-form--input'
              label='Role'
              name='roleId'
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder='Select role'>
                <Option value={RolesId.ADMIN}>Admin</Option>
                <Option value={RolesId.STAFF}>Staff</Option>
                <Option value={RolesId.CLIENT}>Client</Option>
                <Option value={RolesId.TECHNICAL_MANAGER}>Technical Manager</Option>
              </Select>
            </Form.Item>
          </Flex>

          <div className='user-form--submit-btn'>
            <Button loading={false} icon={<PlusOutlined />} size='middle' type='primary' htmlType='submit'>
              Add user
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};

export default CreateUserForm;
