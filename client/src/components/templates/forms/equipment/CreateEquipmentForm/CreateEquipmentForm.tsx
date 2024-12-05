import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Equipment } from "../../../../../types/Equipment";
import { Button, Card, DatePicker, Flex, Form, Input, InputNumber, Modal, Select } from "antd";
import {
  useCreateEquipmentBrand,
  useCreateEquipmentCategory,
  useFetchEquipmentsBrands,
  useFetchEquipmentsCategories,
} from "../../../../../features/equipment/EquipmentHooks";
import TextArea from "antd/es/input/TextArea";
import "./CreateEquipmentForm.scss";
import colors from "../../../../../styles/colors/colors";
const { Option } = Select;

interface CreateEquipmentFormProps {
  onCreateEquipment: (equipment: Partial<Equipment>) => void;
}
export const CreateEquipmentForm: React.FC<CreateEquipmentFormProps> = ({ onCreateEquipment }) => {
  const [userForm] = Form.useForm();
  // State to handle modals for new category and brand
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");

  const { data: categories } = useFetchEquipmentsCategories();
  const { data: brands } = useFetchEquipmentsBrands();
  const createBrandMutation = useCreateEquipmentBrand();
  const createCategoryMutation = useCreateEquipmentCategory();

  const handleFormSubmit = (values: Partial<Equipment>) => {
    onCreateEquipment(values);
    userForm.resetFields();
  };

  // Handlers for adding new category and brand
  const handleAddCategory = () => {
    createCategoryMutation.mutate({ categoryName: newCategory });
    setIsCategoryModalVisible(false);
  };

  const handleAddBrand = () => {
    createBrandMutation.mutate({ brandName: newBrand });
    setIsBrandModalVisible(false);
  };
  return (
    <Form
      name='Update equipment'
      form={userForm}
      layout='vertical'
      autoComplete='off'
      className='equipment-form'
      onFinish={handleFormSubmit}
    >
      <div className='equipment-form'>
        <Card bordered={false}>
          <Flex gap={16} wrap>
            <Form.Item
              className='equipment-form--input'
              label='Serial Number'
              name='serialNumber'
              rules={[{ required: true, message: "Please enter serial number" }]}
            >
              <Input placeholder='Enter serial number' />
            </Form.Item>
            <Form.Item
              className='equipment-form--input'
              label='Equipment Name'
              name='name'
              rules={[{ required: true, message: "Please enter equipment number" }]}
            >
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
              <InputNumber min={1} type='number' style={{ width: "100%" }} placeholder='Enter the purchase cost' />
            </Form.Item>
          </Flex>

          <Flex gap={16} wrap>
            <div style={{ marginBottom: "24px" }}>
              <Form.Item
                className='equipment-form--input'
                style={{ marginBottom: "0" }}
                label='Category'
                name='categoryName'
                rules={[{ required: true, message: "Please select a categoey" }]}
              >
                <Select placeholder='Select a category'>
                  {categories?.data?.map((category) => (
                    <Option key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Button
                style={{ padding: "0", color: `${colors.primary[400]}` }}
                type='link'
                onClick={() => setIsCategoryModalVisible(true)}
              >
                + Add New Category
              </Button>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <Form.Item
                className='equipment-form--input'
                style={{ marginBottom: "0" }}
                label='Brand'
                name='brandName'
                rules={[{ required: true, message: "Please select a Brand" }]}
              >
                <Select placeholder='Select a brand'>
                  {brands?.data?.map((brand) => (
                    <Option key={brand.id} value={brand.brandName}>
                      {brand.brandName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Button
                style={{ padding: "0", color: `${colors.primary[400]}` }}
                type='link'
                onClick={() => setIsBrandModalVisible(true)}
              >
                + Add New Brand
              </Button>
            </div>
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

      {/* Modal for New Category */}
      <Modal
        title='Add New Category'
        open={isCategoryModalVisible}
        onOk={handleAddCategory}
        onCancel={() => setIsCategoryModalVisible(false)}
      >
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder='Enter new category name'
        />
      </Modal>

      {/* Modal for New Brand */}
      <Modal
        title='Add New Brand'
        open={isBrandModalVisible}
        onOk={handleAddBrand}
        onCancel={() => setIsBrandModalVisible(false)}
      >
        <Input value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder='Enter new brand name' />
      </Modal>
    </Form>
  );
};
