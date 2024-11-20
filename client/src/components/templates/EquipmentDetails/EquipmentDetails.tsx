import React from "react";
import "./EquipmentDetails.scss";
import { Card, Typography, Alert, Flex, Avatar } from "antd";
import { formatDateWithoutTime } from "../../../helpers/date";
import { UserOutlined } from "@ant-design/icons";
import { Equipment } from "../../../types/Equipment";
import ConditionTag from "../../atoms/ConditionTag/ConditionTag";

const { Title, Text } = Typography;

interface EquipmentDetailsProps {
  equipment: Partial<Equipment> | null;
}

const EquipmentDetails: React.FC<EquipmentDetailsProps> = ({ equipment }) => {
  if (!equipment) {
    return (
      <Card className='equipment-details-card'>
        <Alert message='Error: equipment data is unavailable. Please reload the page.' type='error' />
      </Card>
    );
  }

  return (
    <div className='equipment-details-cards--container'>
      <Card title='Equipment Details' className='equipment-details-card'>
        <Flex vertical gap={20}>
          <Flex justify={"space-between"} align='center' gap={20} wrap>
            <Title style={{ margin: 0 }} level={4}>
              {equipment.name}
            </Title>
            <Flex gap={8}>
              <Text>Created At: </Text>
              <Text strong>{formatDateWithoutTime(equipment.createdAt)}</Text>
            </Flex>
          </Flex>
          <Flex gap={50} wrap>
            <Flex vertical gap={22} style={{ flex: "1" }}>
              <Flex justify={"space-between"} align='center' gap={8}>
                <Text>Condition:</Text>
                <ConditionTag condition={equipment.condition} />
              </Flex>

              <Flex justify={"space-between"} align='center' gap={8}>
                <Text>Category: </Text>
                <Text strong>{equipment.category?.categoryName || "N/A"}</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8}>
                <Text>Brand: </Text>
                <Text strong>{equipment.brand?.brandName || "N/A"}</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Notes: </Text>
                <Text>{equipment.description || "N/A"}</Text>
              </Flex>
            </Flex>

            <Flex vertical gap={22} style={{ flex: "1" }}>
              <Flex justify={"space-between"} align='center' gap={8}>
                <Text>Warranty End Date: </Text>
                <Text strong>{formatDateWithoutTime(equipment.warrantyEndDate)}</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8}>
                <Text>Purchase date: </Text>
                <Text strong>{formatDateWithoutTime(equipment.purchaseDate)}</Text>
              </Flex>

              <Flex justify={"space-between"} align='center' gap={8}>
                <Text>Purchase Cost: </Text>
                <Text strong>{equipment.purchaseCost} TND</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8}>
                <Text>Purchase Company: </Text>
                <Text strong>{equipment.purchaseCompany}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card>

      {/* Assigned user Details */}

      <>
        <Card title='Assigned User Details' className='equipment-details-card'>
          <Flex align-item='center' gap={40} wrap>
            <div className='equipment-details-card-header'>
              <Avatar size={64} icon={<UserOutlined />} />
              <div className='equipment-details-header-info'>
                <Title level={4}>
                  {equipment.assignedTo?.firstName} {equipment.assignedTo?.lastName}
                </Title>
                <Text>Email:</Text>{" "}
                <Text strong copyable>
                  {equipment.assignedTo?.email}
                </Text>
              </div>
            </div>

            <div className='equipment-details-card-info'>
              <Flex vertical gap={16}>
                <Text strong>Phone:</Text> <Text>{equipment.assignedTo?.phone || "N/A"}</Text>
              </Flex>

              <Flex vertical gap={16}>
                <Text strong>Joined:</Text> <Text> {formatDateWithoutTime(equipment?.createdAt)} </Text>
              </Flex>
            </div>
          </Flex>
        </Card>
      </>
    </div>
  );
};

export default EquipmentDetails;
