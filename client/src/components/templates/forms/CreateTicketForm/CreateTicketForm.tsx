import React, { useState } from "react";
import "./CreateTicketForm.scss";
import { Button, Card, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProjectType } from "../../../../types/Project";
import TextArea from "antd/es/input/TextArea";

import { Ticket, TicketType } from "../../../../types/Ticket";
import { useFetchProjects } from "../../../../features/project/ProjectHooks";
import { useFetchEquipments } from "../../../../features/equipment/EquipmentHooks";
const { Option } = Select;

interface CreateTicketFormProps {
  onCreateTicket: (ticket: Partial<Ticket>) => void;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onCreateTicket }) => {
  const [ticketForm] = Form.useForm();
  const [projectType, setProjectType] = useState<ProjectType | null>(null); // Track project type selection
  const { data: projects } = useFetchProjects({});
  const { data: equipments } = useFetchEquipments({});
  const handleFormSubmit = (values: Partial<Ticket>) => {
    onCreateTicket(values);
    ticketForm.resetFields();
    setProjectType(null);
  };

  const handleProjectChange = (value: number) => {
    const selectedProject = projects?.data?.find((project) => project.id === value);
    console.log(selectedProject);
    if (selectedProject) {
      setProjectType(selectedProject.projectType);
    }
  };

  return (
    <Form form={ticketForm} layout='vertical' autoComplete='off' className='ticket-form' onFinish={handleFormSubmit}>
      <div className='ticket-form'>
        <Card bordered={false}>
          <Form.Item
            className='ticket-form--input'
            label='Select a project'
            name='projectId'
            rules={[{ required: true, message: "Please select a Project" }]}
          >
            <Select placeholder='Select a project' onChange={handleProjectChange}>
              {projects?.data?.map((project) => (
                <Option key={project?.id} value={project?.id}>
                  {project?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className='ticket-form--input'
            label='Ticket Title'
            name='title'
            rules={[
              { required: true, message: "Please enter ticket title" },
              { min: 3, message: "Title must be at least 3 characters long" },
            ]}
          >
            <Input placeholder='Enter ticket title' />
          </Form.Item>

          <Form.Item
            className='ticket-form--input'
            label='Select thye ticket type'
            name='type'
            rules={[{ required: true, message: "Please select the ticket type" }]}
          >
            <Select placeholder='Select the ticket type'>
              <Option value={TicketType.CONSULTATION}>Consultation</Option>
              <Option value={TicketType.FEATURE}>Feature</Option>
              <Option value={TicketType.REQUEST}>Request</Option>
              <Option value={TicketType.BUG}>Bug</Option>
              <Option value={TicketType.OTHER}>Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            className='ticket-form--input'
            label='Description'
            name='description'
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Conditionally Rendered Fields */}
          {projectType === ProjectType.INTERNAL && (
            <Form.Item
              className='ticket-form--input'
              label='If an equipment is damaged, please specify.'
              name='equipmentId'
            >
              <Select placeholder='Select an equipment'>
                {equipments?.data?.map((equipment) => (
                  <Option key={equipment?.id} value={equipment?.id}>
                    {equipment?.name} | {equipment?.category?.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Submit Button */}
          <div className='ticket-form--submit-btn'>
            <Button loading={false} icon={<PlusOutlined />} size='middle' type='primary' htmlType='submit'>
              Add a ticket
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};

export default CreateTicketForm;
