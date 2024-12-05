import React from "react";
import "./EquipmentDetails.scss";
import { Card, Typography, Alert, Flex, Avatar } from "antd";
import { formatDateWithoutTime } from "../../../helpers/date";
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
            <Flex vertical gap={22} style={{ flex: "1" }} wrap>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Serial number:</Text>
                <Text strong>{equipment?.serialNumber || "N/A"}</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Condition:</Text>
                <ConditionTag condition={equipment?.condition} />
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Category: </Text>
                <Text strong>{equipment?.category?.categoryName || "N/A"}</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Brand: </Text>
                <Text strong>{equipment?.brand?.brandName || "N/A"}</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Notes: </Text>
                <Text>{equipment.description || "N/A"}</Text>
              </Flex>
            </Flex>

            <Flex vertical gap={22} style={{ flex: "1" }} wrap>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Warranty End Date: </Text>
                <Text strong>{formatDateWithoutTime(equipment?.warrantyEndDate)}</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Purchase date: </Text>
                <Text strong>{formatDateWithoutTime(equipment?.purchaseDate)}</Text>
              </Flex>

              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Purchase Cost: </Text>
                <Text strong>{equipment?.purchaseCost} TND</Text>
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Purchase Company: </Text>
                <Text strong>{equipment?.purchaseCompany}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card>

      {/* Assigned user Details */}

      <>
        {equipment?.assignedTo && (
          <Card title='Assigned User Details' className='equipment-details-card'>
            <Flex align-item='center' gap={40} wrap>
              <div className='equipment-details-card-header'>
                <Avatar size={64} style={{ backgroundColor: "#f3eae2", color: "#755c42" }}>
                  <Title style={{ marginBottom: 5 }} level={3}>
                    {equipment?.assignedTo?.firstName?.substring(0, 2).toUpperCase()}
                  </Title>
                </Avatar>
                <div className='equipment-details-header-info'>
                  <Title level={4}>
                    {equipment?.assignedTo?.firstName} {equipment?.assignedTo?.lastName}
                  </Title>
                  <Text>Email:</Text>{" "}
                  <Text strong copyable>
                    {equipment.assignedTo?.email}
                  </Text>
                </div>
              </div>

              <div className='equipment-details-card-info'>
                <Flex vertical gap={16}>
                  <Text strong>Phone:</Text> <Text>{equipment?.assignedTo?.phone || "N/A"}</Text>
                </Flex>

                <Flex vertical gap={16}>
                  <Text strong>Joined:</Text> <Text> {formatDateWithoutTime(equipment?.createdAt)} </Text>
                </Flex>
              </div>
            </Flex>
          </Card>
        )}
      </>
    </div>
  );
};

export default EquipmentDetails;
