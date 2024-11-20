import React, { useEffect } from "react";
import "./UpdateProjectForm.scss";
import { Button, Card, Flex, Form, Input, Select } from "antd";
import { Project } from "../../../../types/Project";
import TextArea from "antd/es/input/TextArea";
import { useFetchUsers } from "../../../../features/user/UserHooks";
const { Option } = Select;

interface UpdateProjectFormProps {
  onUpdateProject: (project: Partial<Project>) => void;
  projectToUpdate: Partial<Project>;
}

const UpdateProjectForm: React.FC<UpdateProjectFormProps> = ({ onUpdateProject, projectToUpdate }) => {
  const [projectForm] = Form.useForm();
  const { data: technicalManagers } = useFetchUsers({ roleId: 5 });
  const { data: clients } = useFetchUsers({ roleId: 4 });
  const { data: staff } = useFetchUsers({ roleId: 3 });
  useEffect(() => {
    // Ensure the correct format for managers and teamMembers (array of IDs)
    const updatedProject = {
      ...projectToUpdate,
      managers: projectToUpdate.managers?.map((manager) => manager.id) || [],
      teamMembers: projectToUpdate.teamMembers?.map((member) => member.id) || [],
    };

    projectForm.setFieldsValue(updatedProject);
  }, [projectToUpdate, projectForm]);

  const handleFormSubmit = (values: Partial<Project>) => {
    onUpdateProject(values);
  };

  return (
    <Form form={projectForm} layout='vertical' autoComplete='off' className='project-form' onFinish={handleFormSubmit}>
      <div className='project-form'>
        <Card bordered={false}>
          <Flex gap={16} wrap>
            <Form.Item
              className='project-form--input'
              label='Project Name'
              name='name'
              rules={[{ required: true, message: "Please enter project name" }]}
            >
              <Input placeholder='Enter project name' />
            </Form.Item>
          </Flex>
          <Form.Item
            className='project-form--input'
            label='Description'
            name='description'
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {projectToUpdate.projectType === "INTERNAL" && (
            <Form.Item
              className='project-form--input'
              label='Technical Manager'
              name='technicalManagerId'
              rules={[{ required: true, message: "Please select a Technical Manager" }]}
            >
              <Select placeholder='Select a technical manager'>
                {technicalManagers?.data?.map((manager) => (
                  <Option key={manager.id} value={manager.id}>
                    {manager.firstName} {manager.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {projectToUpdate.projectType === "EXTERNAL" && (
            <>
              <Flex gap={16} wrap>
                <Form.Item
                  className='project-form--input'
                  label='Client'
                  name='clientId'
                  rules={[{ required: true, message: "Please select a client" }]}
                >
                  <Select placeholder='Select client'>
                    {clients?.data?.map((client) => (
                      <Option key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  className='project-form--input'
                  label='Project Managers'
                  name='managers'
                  rules={[{ required: true, message: "Please select a project manager" }]}
                >
                  <Select mode='multiple' placeholder='Select project managers'>
                    {staff?.data?.map((manager) => (
                      <Option key={manager.id} value={manager.id}>
                        {manager.firstName} {manager.lastName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Flex>

              <Form.Item
                className='project-form--input'
                label='Team Members'
                name='teamMembers'
                rules={[{ required: true, message: "Please select team members" }]}
              >
                <Select mode='multiple' placeholder='Select team members'>
                  {staff?.data?.map((member) => (
                    <Option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          <div className='project-form--submit-btn'>
            <Button loading={false} size='middle' type='primary' htmlType='submit'>
              Update Project
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};

export default UpdateProjectForm;
