import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Equipment } from "../../../../types/Equipment";
import { Button, Card, DatePicker, Flex, Form, Input, InputNumber, Select } from "antd";
import { useFetchEquipmentsBrands, useFetchEquipmentsCategories } from "../../../../features/equipment/EquipmentHooks";
import TextArea from "antd/es/input/TextArea";
import "./CreateEquipmentForm.scss";
const { Option } = Select;

interface CreateEquipmentFormProps {
  onCreateEquipment: (equipment: Partial<Equipment>) => void;
}
export const CreateEquipmentForm: React.FC<CreateEquipmentFormProps> = ({ onCreateEquipment }) => {
  const [userForm] = Form.useForm();
  const { data: categories } = useFetchEquipmentsCategories();
  const { data: brands } = useFetchEquipmentsBrands();
  const handleFormSubmit = (values: Partial<Equipment>) => {
    onCreateEquipment(values);
    userForm.resetFields();
  };

  return (
    <Form form={userForm} layout='vertical' autoComplete='off' className='equipment-form' onFinish={handleFormSubmit}>
      <div className='equipment-form'>
        <Card bordered={false}>
          <Flex gap={16} wrap>
            <Form.Item
              className='equipment-form--input'
              label='Serial Number'
              name='serialNumber'
              rules={[{ required: true, message: "Please enter project name" }]}
            >
              <Input placeholder='Enter project name' />
            </Form.Item>
            <Form.Item className='equipment-form--input' label='Equipment Name' name='name'>
              <Input placeholder='Enter equipment name' />
            </Form.Item>

            <Form.Item className='equipment-form--input' label='Purchase Company' name='purchaseCompany'>
              <Input placeholder='Enter Purchase Company name' />
            </Form.Item>
          </Flex>
          <Flex gap={16} wrap>
            <Form.Item
              className='equipment-form--input'
              label='Purchase Date'
              name='purchaseDate'
              rules={[{ required: true, message: "Please enter the Purchase date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              className='equipment-form--input'
              label='Warranty End Date'
              name='warrantyEndDate'
              rules={[{ required: true, message: "Please enter the warranty end  date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item className='equipment-form--input' label='Purchase Cost' name='purchaseCost'>
              <InputNumber style={{ width: "100%" }} placeholder='Enter the purchase cost' />
            </Form.Item>
          </Flex>

          <Flex gap={16} wrap>
            <Form.Item
              className='equipment-form--input'
              label='Category'
              name='categoryName'
              rules={[{ required: true, message: "Please select a client" }]}
            >
              <Select placeholder='Select client'>
                {categories?.data?.map((category) => (
                  <Option key={category.id} value={category.categoryName}>
                    {category.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              className='equipment-form--input'
              label='Brand'
              name='brandName'
              rules={[{ required: true, message: "Please select a project manager" }]}
            >
              <Select placeholder='Select project managers'>
                {brands?.data?.map((brand) => (
                  <Option key={brand.id} value={brand.brandName}>
                    {brand.brandName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Flex>
          <Flex>
            <Form.Item className='equipment-form--input' label='Description' name='description'>
              <TextArea rows={2} placeholder='You can write any notes' />
            </Form.Item>
          </Flex>

          {/* Submit Button */}
          <div className='equipment-form--submit-btn'>
            <Button loading={false} icon={<PlusOutlined />} size='middle' type='primary' htmlType='submit'>
              Add Equipment
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};
