import React, { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Condition, Equipment } from "../../../../../types/Equipment";
import { Button, Card, DatePicker, Flex, Form, Input, InputNumber, Modal, Select } from "antd";
import {
  useFetchEquipmentsBrands,
  useFetchEquipmentsCategories,
} from "../../../../../features/equipment/EquipmentHooks";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;

interface UpdateEquipmentFormProps {
  onUpdateEquipment: (equipment: Partial<Equipment>) => void;
  equipmentToUpdate: Partial<Equipment>;
}
export const UpdateEquipmentForm: React.FC<UpdateEquipmentFormProps> = ({ onUpdateEquipment, equipmentToUpdate }) => {
  const [equipmentForm] = Form.useForm();

  const { data: categories } = useFetchEquipmentsCategories();
  const { data: brands } = useFetchEquipmentsBrands();

  useEffect(() => {
    const updatedEquipmen = {
      ...equipmentToUpdate,
      purchaseDate: equipmentToUpdate.purchaseDate ? dayjs(equipmentToUpdate.purchaseDate) : null,
      warrantyEndDate: equipmentToUpdate.warrantyEndDate ? dayjs(equipmentToUpdate.warrantyEndDate) : null,
      brandId: equipmentToUpdate.brand?.id,
      categoryId: equipmentToUpdate.category?.id,
    };
    equipmentForm.setFieldsValue(updatedEquipmen);
  }, [equipmentToUpdate, equipmentForm]);

  const handleFormSubmit = (values: Partial<Equipment>) => {
    onUpdateEquipment(values);
    equipmentForm.resetFields();
  };

  return (
    <Form
      form={equipmentForm}
      layout='vertical'
      autoComplete='off'
      className='equipment-form'
      onFinish={handleFormSubmit}
    >
      <div className='equipment-form'>
        <Card bordered={false}>
          <Flex gap={16} wrap>
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
              <DatePicker
                style={{ width: "100%" }}
                value={equipmentToUpdate.purchaseDate ? dayjs(equipmentToUpdate.purchaseDate) : null}
              />
            </Form.Item>

            <Form.Item
              className='equipment-form--input'
              label='Warranty End Date'
              name='warrantyEndDate'
              rules={[{ required: true, message: "Please enter the warranty end  date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                value={equipmentToUpdate.warrantyEndDate ? dayjs(equipmentToUpdate.warrantyEndDate) : null}
              />
            </Form.Item>
          </Flex>
          <Flex gap={16} wrap>
            <Form.Item className='equipment-form--input' label='Purchase Cost' name='purchaseCost'>
              <InputNumber style={{ width: "100%" }} placeholder='Enter the purchase cost' />
            </Form.Item>
            <Form.Item
              className='equipment-form--input'
              label='Condition'
              name='condition'
              rules={[{ required: true, message: "Please enter the warranty end  date" }]}
            >
              <Select placeholder='Select a condition'>
                {Object.values(Condition).map((condition) => (
                  <Option key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase()}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Flex>
          <Flex gap={16} wrap>
            <Form.Item
              className='equipment-form--input'
              label='Category'
              name='categoryId'
              rules={[{ required: true, message: "Please select a brand" }]}
            >
              <Select placeholder='Select a category'>
                {categories?.data?.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              className='equipment-form--input'
              label='Brand'
              name='brandId'
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder='Select a brand'>
                {brands?.data?.map((brand) => (
                  <Option key={brand.id} value={brand.id}>
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
              Update Equipment
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};
