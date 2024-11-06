import React, { useState } from "react";
import "./CreateProjectForm.scss";
import { Button, Card, Flex, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { User } from "../../../../types/User";
import { RolesId } from "../../../../types/Role";
import { ProjectType } from "../../../../types/Project";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;

interface CreateProjectFormProps {
  onCreateProject: (user: Partial<User>) => void;
  clients: Partial<User>[];
  projectManagers: Partial<User>[];
  technicalManagers: Partial<User>[];
  teamMembers: Partial<User>[];
}

const CreateUserForm: React.FC<CreateProjectFormProps> = ({
  onCreateProject,
  clients,
  projectManagers,
  technicalManagers,
  teamMembers,
}) => {
  const [userForm] = Form.useForm();
  const [projectType, setProjectType] = useState<ProjectType | null>(null); // Track project type selection

  const handleFormSubmit = (values: Partial<User>) => {
    onCreateProject(values);
    userForm.resetFields();
    setProjectType(null);
  };

  return (
    <Form form={userForm} layout='vertical' autoComplete='off' className='user-form' onFinish={handleFormSubmit}>
      <div className='user-form'>
        <Card bordered={false}>
          {/* Project Name and Project Type */}
          <Flex gap={16} wrap>
            <Form.Item
              className='user-form--input'
              label='Project Name'
              name='name'
              rules={[{ required: true, message: "Please enter project name" }]}
            >
              <Input placeholder='Enter project name' />
            </Form.Item>

            <Form.Item
              className='user-form--input'
              label='Project Type'
              name='projectType'
              rules={[{ required: true, message: "Select the project type" }]}
            >
              <Select placeholder='Select Project Type' onChange={(value) => setProjectType(value as ProjectType)}>
                <Option value={ProjectType.EXTERNAL}>External</Option>
                <Option value={ProjectType.INTERNAL}>Internal</Option>
              </Select>
            </Form.Item>
          </Flex>

          {/* Description */}
          <Form.Item
            className='user-form--input'
            label='Description'
            name='description'
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Conditionally Rendered Fields */}
          {projectType === ProjectType.INTERNAL && (
            <Form.Item
              className='user-form--input'
              label='Technical Manager'
              name='technicalManagerId'
              rules={[{ required: true, message: "Please select a Technical Manager" }]}
            >
              <Select placeholder='Select a technical manager'>
                {technicalManagers.map((manager) => (
                  <Option key={manager.id} value={manager.id}>
                    {manager.firstName} {manager.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {projectType === ProjectType.EXTERNAL && (
            <>
              <Flex gap={16} wrap>
                <Form.Item
                  className='user-form--input'
                  label='Client'
                  name='client'
                  rules={[{ required: true, message: "Please select a client" }]}
                >
                  <Select placeholder='Select client'>
                    {clients.map((client) => (
                      <Option key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  className='user-form--input'
                  label='Project Managers'
                  name='managers'
                  rules={[{ required: true, message: "Please select a project manager" }]}
                >
                  <Select mode='multiple' placeholder='Select project managers'>
                    {projectManagers.map((manager) => (
                      <Option key={manager.id} value={manager.id}>
                        {manager.firstName} {manager.lastName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Flex>

              <Form.Item
                className='user-form--input'
                label='Team Members'
                name='teamMembers'
                rules={[{ required: true, message: "Please select team members" }]}
              >
                <Select mode='multiple' placeholder='Select team members'>
                  {teamMembers.map((member) => (
                    <Option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {/* Submit Button */}
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
