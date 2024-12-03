import React from "react";
import "./TicketDetails.scss";
import { Card, Typography, Table, TableProps, Alert, Flex } from "antd";
import { User } from "../../../types/User";
import { formatDate } from "../../../helpers/date";
import { Ticket } from "../../../types/Ticket";
import TicketPriorityTag from "../../atoms/TicketPriorityTag/TicketPriorityTag";
import TicketStatusTag from "../../atoms/TicketStatusTag/TicketStatusTag";
import TicketTypeTag from "../../atoms/TicketTypeTag/TicketTypeTag";
import ProjectTypeTag from "../../atoms/ProjectTypeTag/ProjectTypeTag";
import colors from "../../../styles/colors/colors";

const { Title, Text } = Typography;

interface TicketDetailsProps {
  ticket: Partial<Ticket> | null;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket }) => {
  if (!ticket) {
    return (
      <Card className='ticket-details-card'>
        <Alert message='Error: Ticket data is unavailable. Please reload the page.' type='error' />
      </Card>
    );
  }

  const userTableColumns: TableProps<Partial<User>>["columns"] = [
    {
      title: "First Name",
      render: (user: User) => `${user.firstName}`,
      key: "firstName",
    },
    {
      title: "Last Name",
      render: (user: User) => `${user.lastName}`,
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <div className='ticket-details-cards--container'>
      <Card title='Ticket Overview' className='ticket-details-card'>
        <Flex vertical gap={20} wrap>
          <Flex justify={"start"} align='end' gap={20} wrap>
            <Title style={{ margin: 0 }} level={4}>
              {ticket?.title}
            </Title>
          </Flex>
          <Flex gap={50} wrap>
            <Flex vertical gap={22} style={{ flex: "1" }} wrap>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Status:</Text>
                <TicketStatusTag ticketStatus={ticket?.status} />
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Priority: </Text>
                <TicketPriorityTag priority={ticket?.priority} />
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Type: </Text>
                <TicketTypeTag type={ticket?.type} />
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Project Name: </Text>
                <Text strong>{ticket?.project?.name}</Text>
              </Flex>
            </Flex>

            <Flex vertical gap={22} style={{ flex: "1" }} wrap>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Project Type: </Text>
                <ProjectTypeTag projectTypeTag={ticket?.project?.projectType} />
              </Flex>
              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Updated date: </Text>
                <Text strong>{formatDate(ticket?.updatedAt)}</Text>
              </Flex>

              <Flex justify={"space-between"} align='center' gap={8} wrap>
                <Text>Created date: </Text>
                <Text strong>{formatDate(ticket?.createdAt)}</Text>
              </Flex>
              {ticket.equipmentId && (
                <Flex justify={"space-between"} align='center' gap={8} wrap>
                  <Text style={{ color: colors.red[400] }}>Damaged Equipment: </Text>
                  <Text style={{ color: "red" }} strong>
                    {ticket.equipment?.name}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
          <Flex vertical style={{ backgroundColor: colors.primary[10], padding: "10px", borderRadius: "6px" }} gap={8}>
            <Text strong>Description: </Text>
            <Text>{ticket?.description || "N/A"}</Text>
          </Flex>
        </Flex>
      </Card>

      <Card title='Assigned To'>
        <Table
          dataSource={ticket.assignedUsers}
          columns={userTableColumns}
          rowKey='id'
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Comment section  */}
      <Card title='Comments'></Card>
    </div>
  );
};

export default TicketDetails;
