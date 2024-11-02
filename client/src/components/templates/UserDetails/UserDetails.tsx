import React from "react";
import "./UserDetails.scss";
import { Card, Avatar, Empty, Typography, Divider, List } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { User } from "../../../types/User";
import { RolesId } from "../../../types/Role";

const { Title, Text } = Typography;

interface UserDetailsProps {
  user: Partial<User> | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  // Helper function to render a section title with a divider
  const renderSectionTitle = (title: string) => <Divider orientation='left'>{title}</Divider>;

  if (!user) {
    return (
      <Card className='user-details-card'>
        <Empty description='No user details available' />
      </Card>
    );
  }

  return user ? (
    <Card className='user-details-card'>
      <div className='user-details-header'>
        <Avatar size={80} icon={<UserOutlined />} />
        <div className='user-details-header-info'>
          <Title level={4}>
            {user.firstName} {user.lastName}
          </Title>
          <Text type='secondary'>{user.role?.roleName}</Text>
        </div>
      </div>

      <div className='user-details-info'>
        <Text strong>Email:</Text> <Text>{user.email}</Text>
        <Text strong>Phone:</Text> <Text>{user.phone || "N/A"}</Text>
        <Text strong>Role:</Text> <Text>{user.role?.roleName}</Text>
        {/* <Text strong>Joined:</Text> <Text>{user.createdAt?.toDateString()}</Text> */}
      </div>

      {/* Render additional details based on user role */}
      {user.role?.id === RolesId.CLIENT && (
        <>
          {renderSectionTitle("Client Projects")}
          <List
            size='small'
            dataSource={user.projects || []}
            renderItem={(project) => <List.Item>{project.name}</List.Item>}
            locale={{ emptyText: "No projects found" }}
          />
        </>
      )}

      {user.role?.id === RolesId.STAFF && (
        <>
          {renderSectionTitle("Staff Projects")}
          <List
            size='small'
            dataSource={user.projects || []}
            renderItem={(project) => <List.Item>{project.name}</List.Item>}
            locale={{ emptyText: "Not assigned to any project" }}
          />

          {renderSectionTitle("Managed Projects")}
          <List
            size='small'
            dataSource={user.managedProjects || []}
            renderItem={(project) => <List.Item>{project.name}</List.Item>}
            locale={{ emptyText: "No managed projects" }}
          />

          {renderSectionTitle("Assigned Equipment")}
          <List
            size='small'
            dataSource={user.equipments || []}
            renderItem={(equipment) => <List.Item>{equipment.name}</List.Item>}
            locale={{ emptyText: "No equipment assigned" }}
          />
        </>
      )}

      {user.role?.id === RolesId.TECHNICAL_MANAGER && (
        <>
          {renderSectionTitle("Assigned Project")}
          <List
            size='small'
            dataSource={user.techManagedProjects || []}
            renderItem={(project) => <List.Item>{project.name}</List.Item>}
            locale={{ emptyText: "No projects assigned" }}
          />
          {renderSectionTitle("Assigned Equipment")}
          <List
            size='small'
            dataSource={user.equipments || []}
            renderItem={(equipment) => <List.Item>{equipment.name}</List.Item>}
            locale={{ emptyText: "No equipment assigned" }}
          />
        </>
      )}
    </Card>
  ) : (
    <div></div>
  );
};

export default UserDetails;
