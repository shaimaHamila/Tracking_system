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
        <Flex vertical gap={16}>
          <Flex justify={"space-between"} align='center' gap={20}>
            <Title level={4}>{equipment.name}</Title>
            <Flex gap={8}>
              <Text strong>Created At: </Text>
              <Text>{formatDateWithoutTime(equipment.createdAt)}</Text>
            </Flex>
          </Flex>
          <Text strong>
            Condition: <ConditionTag condition={equipment.condition} />
          </Text>
          <Flex gap={8}>
            <Text strong>Notes: </Text>
            <Text>{equipment.description || "N/A"}</Text>
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
                <Text strong>Email:</Text> <Text copyable>{equipment.assignedTo?.email}</Text>
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
