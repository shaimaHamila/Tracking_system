import React, { useState } from "react";
import "./CreateUserForm.scss";
import { Button, Card, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
const CreateUserForm: React.FC = () => {
  const [form] = Form.useForm();
  const [role, setRole] = useState("");

  // Dummy data for selections
  const clientProjects = [
    { id: 1, name: "Client Project A" },
    { id: 2, name: "Client Project B" },
  ];
  const staffProjects = [
    { id: 1, name: "Staff Project A" },
    { id: 2, name: "Staff Project B" },
  ];
  const equipmentOptions = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Monitor" },
    { id: 3, name: "Keyboard" },
  ];
  return (
    <Form form={form} layout='vertical' size='large' style={{ marginTop: "0.5rem" }}>
      <div className='user-form'>
        <Card bordered={false}>
          {/* Basic Fields */}
          <Form.Item
            label='First Name'
            name='firstName'
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder='Enter first name' />
          </Form.Item>

          <Form.Item label='Last Name' name='lastName' rules={[{ required: true, message: "Please enter last name" }]}>
            <Input placeholder='Enter last name' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <Input placeholder='Enter email' />
          </Form.Item>

          <Form.Item label='Phone Number' name='phoneNumber'>
            <Input placeholder='Enter phone number (optional)' />
          </Form.Item>

          <Form.Item label='Password' name='password' rules={[{ required: true, message: "Please enter password" }]}>
            <Input.Password placeholder='Enter password' />
          </Form.Item>

          {/* Role Selection */}
          <Form.Item label='Role' name='role' rules={[{ required: true, message: "Please select a role" }]}>
            <Select placeholder='Select role' onChange={(value) => setRole(value)}>
              <Option value='admin'>Admin</Option>
              <Option value='staff'>Staff</Option>
              <Option value='techManager'>Tech Manager</Option>
            </Select>
          </Form.Item>

          {/* Conditional Fields */}
          {role === "admin" && (
            <Form.Item label='Client Project (Optional)' name='clientProjectId'>
              <Select placeholder='Select client project'>
                {clientProjects.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {role === "staff" && (
            <>
              <Form.Item label='Projects Working On' name='staffProjects'>
                <Select mode='multiple' placeholder='Select projects'>
                  {staffProjects.map((project) => (
                    <Option key={project.id} value={project.id}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label='Equipment Used' name='staffEquipment'>
                <Select mode='multiple' placeholder='Select equipment'>
                  {equipmentOptions.map((equipment) => (
                    <Option key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {role === "techManager" && (
            <>
              <Form.Item label='Project' name='techManagerProject'>
                <Select placeholder='Select project'>
                  {clientProjects.map((project) => (
                    <Option key={project.id} value={project.id}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label='Equipment Used' name='techManagerEquipment'>
                <Select mode='multiple' placeholder='Select equipment'>
                  {equipmentOptions.map((equipment) => (
                    <Option key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {/* Submit Button */}
          <div className='user-form--submit-btn' style={{ marginTop: "1.5rem" }}>
            <Button loading={false} icon={<PlusOutlined />} size='large' type='primary' htmlType='submit' shape='round'>
              Submit Order
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};

export default CreateUserForm;
