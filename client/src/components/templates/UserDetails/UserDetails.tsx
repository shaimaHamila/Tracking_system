import React from "react";
import "./UserDetails.scss";
import { Card, Avatar, Typography, Divider, List, Alert, Flex, Table, TableProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { User } from "../../../types/User";
import { RolesId } from "../../../types/Role";
import { formatDateWithoutTime } from "../../../helpers/date";
import RoleTag from "../../atoms/RoleTag/RoleTag";
import { Project } from "../../../types/Project";
import { Equipment } from "../../../types/Equipment";

const { Title, Text } = Typography;

interface UserDetailsProps {
  user: Partial<User> | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  // Helper function to render a section title with a divider
  console.log("aaaaaaaaaaaaaaaaa", user);
  if (!user) {
    return (
      <Card className='user-details-card'>
        <Alert message='Error please reload the page' type='error' />
      </Card>
    );
  }
  const getProjectsData = () => {
    switch (user.role?.id) {
      case RolesId.CLIENT:
        return { title: "Client Projects", data: user.clientProjects };
      case RolesId.STAFF:
        return { title: "Assigned Projects", data: user.projects };
      case RolesId.TECHNICAL_MANAGER:
        return { title: "Technical Managed Projects", data: user.techManagedProjects };
      case RolesId.ADMIN:
        return { title: "Admin Created Projects", data: user.createdProjects };
      default:
        return { title: "Projects", data: [] };
    }
  };

  const { title: projectTitle, data: projectData } = getProjectsData();
  const projecTableColumns: TableProps<Partial<Project>>["columns"] = [
    {
      title: "",
      key: "number",
      width: 50,
      render: (_, _record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDateWithoutTime(date),
    },
  ];

  const equipmentTableColumns: TableProps<Partial<Equipment>>["columns"] = [
    {
      title: "",
      key: "number",
      width: 50,
      render: (_, _record, index) => index + 1,
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: ["category", "categoryName"],
      key: "category",
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
    },
  ];
  return (
    <div className='user-details-cards--container'>
      <Card title='General info' className='user-details-card'>
        <Flex align-item='center' gap={40} wrap>
          <div className='user-details-card-header'>
            <Avatar size={64} icon={<UserOutlined />} />
            <div className='user-details-header-info'>
              <Title level={4}>
                {user.firstName} {user.lastName}
              </Title>
              <Text strong>Email:</Text> <Text copyable>{user.email}</Text>
            </div>
          </div>

          <div className='user-details-card-info'>
            <Flex vertical gap={16}>
              <Text strong>Phone:</Text> <Text>{user.phone || "N/A"}</Text>
            </Flex>
            <Flex vertical gap={16}>
              <Text strong>Role:</Text> <RoleTag role={user?.role} />
            </Flex>
            <Flex vertical gap={16}>
              <Text strong>Joined:</Text> <Text> {formatDateWithoutTime(user?.createdAt)} </Text>
            </Flex>
          </div>
        </Flex>
      </Card>
      {user.role?.id === RolesId.STAFF && (
        <Card title='Managed Projects as a Project manager'>
          <Table
            dataSource={user?.managedProjects}
            columns={projecTableColumns}
            rowKey='id'
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </Card>
      )}
      <Card title={projectTitle}>
        <Table
          dataSource={projectData}
          columns={projecTableColumns}
          rowKey='id'
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </Card>
      {user.role?.id != RolesId.CLIENT && (
        <Card title='Equipments'>
          <Table
            dataSource={user?.equipments}
            columns={equipmentTableColumns}
            rowKey='id'
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </Card>
      )}
    </div>
  );
};

export default UserDetails;
