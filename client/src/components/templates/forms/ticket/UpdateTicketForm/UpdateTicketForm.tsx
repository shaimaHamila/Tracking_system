import React, { useEffect } from "react";
import "./UpdateTicketForm.scss";
import { Button, Card, Form, Input, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { ProjectType } from "../../../../../types/Project";
import TextArea from "antd/es/input/TextArea";

import { Ticket, TicketType } from "../../../../../types/Ticket";
import { useFetchEquipments } from "../../../../../features/equipment/EquipmentHooks";
const { Option } = Select;

interface UpdateTicketFormProps {
  ticket: Partial<Ticket>;
  onUpdateTicket: (updatedTicket: Partial<Ticket>) => void;
}

const UpdateTicketForm: React.FC<UpdateTicketFormProps> = ({ ticket, onUpdateTicket }) => {
  const [ticketForm] = Form.useForm();
  const { data: equipments } = useFetchEquipments({});

  useEffect(() => {
    if (ticket) {
      ticketForm.setFieldsValue(ticket);
    }
  }, [ticket, ticketForm]);

  const handleFormSubmit = (values: Partial<Ticket>) => {
    onUpdateTicket(values);
  };

  return (
    <Form form={ticketForm} layout='vertical' autoComplete='off' className='ticket-form' onFinish={handleFormSubmit}>
      <div className='ticket-form'>
        <Card bordered={false}>
          {/* Ticket Title */}
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

          {/* Ticket Type */}
          <Form.Item
            className='ticket-form--input'
            label='Select the ticket type'
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

          {/* Description */}
          <Form.Item
            className='ticket-form--input'
            label='Description'
            name='description'
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Conditionally Rendered Fields */}
          {ticket?.project?.projectType === ProjectType.INTERNAL && (
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
            <Button loading={false} icon={<SaveOutlined />} size='middle' type='primary' htmlType='submit'>
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};

export default UpdateTicketForm;
