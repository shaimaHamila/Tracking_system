import React, { useEffect } from "react";
import { Button, Card, Flex, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { User } from "../../../../types/User";
import { RolesId } from "../../../../types/Role";
const { Option } = Select;

interface UpdateUserFormProps {
  onUpdateUser: (user: Partial<User>) => void;
  user: Partial<User>;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ onUpdateUser, user }) => {
  const [userForm] = Form.useForm();
  useEffect(() => {
    userForm.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      roleId: user.role?.id || null, // Ensure you are mapping to the correct property
    });
  }, [user, userForm]);
  const handleFormSubmit = (values: Partial<User>) => {
    onUpdateUser(values);
    userForm.resetFields();
  };
  return (
    <Form
      initialValues={user}
      form={userForm}
      layout='vertical'
      autoComplete='off'
      className='user-form'
      onFinish={handleFormSubmit}
    >
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
            <Form.Item label='Phone Number' name='phone' className='user-form--input'>
              <Input placeholder='Enter phone number (optional)' />
            </Form.Item>
          </Flex>

          <div className='user-form--submit-btn'>
            <Button loading={false} icon={<PlusOutlined />} size='middle' type='primary' htmlType='submit'>
              Update user
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};

export default UpdateUserForm;
