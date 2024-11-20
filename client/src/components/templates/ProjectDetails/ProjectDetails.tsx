import React from "react";
import "./ProjectDetails.scss";
import { Card, Typography, Table, TableProps, Alert, Flex, Avatar } from "antd";
import { Project, ProjectType } from "../../../types/Project";
import { User } from "../../../types/User";
import { formatDateWithoutTime } from "../../../helpers/date";
import { UserOutlined } from "@ant-design/icons";
import ProjectTypeTag from "../../atoms/ProjectTypeTag/ProjectTypeTag";

const { Title, Text } = Typography;

interface ProjectDetailsProps {
  project: Partial<Project> | null;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  if (!project) {
    return (
      <Card className='project-details-card'>
        <Alert message='Error: Project data is unavailable. Please reload the page.' type='error' />
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
    <div className='project-details-cards--container'>
      {/* General Project Information */}
      <Card title='Project Overview' className='project-details-card'>
        <Flex vertical gap={16}>
          <Flex justify={"space-between"} align='center' gap={20}>
            <Title level={4}>{project.name}</Title>
            <Flex gap={8}>
              <Text strong>Created At: </Text>
              <Text>{formatDateWithoutTime(project.createdAt)}</Text>
            </Flex>
          </Flex>
          <Text strong>
            Type: <ProjectTypeTag projectTypeTag={project.projectType} />{" "}
          </Text>
          <Flex gap={8}>
            <Text strong>Description: </Text>
            <Text>{project.description || "N/A"}</Text>
          </Flex>
        </Flex>
      </Card>

      {/* Project Details Based on Type */}
      {project.projectType === ProjectType.EXTERNAL && (
        <>
          <Card title='Client Information' className='project-details-card'>
            <Flex align-item='center' gap={40} wrap>
              <div className='project-details-card-header'>
                <Avatar size={64} icon={<UserOutlined />} />
                <div className='project-details-header-info'>
                  <Title level={4}>
                    {project.client?.firstName} {project.client?.lastName}
                  </Title>
                  <Text strong>Email:</Text> <Text copyable>{project.client?.email}</Text>
                </div>
              </div>

              <div className='project-details-card-info'>
                <Flex vertical gap={16}>
                  <Text strong>Phone:</Text> <Text>{project.client?.phone || "N/A"}</Text>
                </Flex>

                <Flex vertical gap={16}>
                  <Text strong>Joined:</Text> <Text> {formatDateWithoutTime(project?.createdAt)} </Text>
                </Flex>
              </div>
            </Flex>
          </Card>

          <Card title='Project Managers'>
            <Table
              dataSource={project.managers}
              columns={userTableColumns}
              rowKey='id'
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          </Card>

          <Card title='Team Members'>
            <Table
              dataSource={project.teamMembers}
              columns={userTableColumns}
              rowKey='id'
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </>
      )}

      {project.projectType === ProjectType.INTERNAL && (
        <Card title='Technical Manager Information' className='project-details-card'>
          <Flex align-item='center' gap={40} wrap>
            <div className='project-details-card-header'>
              <Avatar size={64} icon={<UserOutlined />} />
              <div className='project-details-header-info'>
                <Title level={4}>
                  {project.technicalManager?.firstName} {project.technicalManager?.lastName}
                </Title>
                <Text strong>Email:</Text> <Text copyable>{project.technicalManager?.email}</Text>
              </div>
            </div>

            <div className='project-details-card-info'>
              <Flex vertical gap={16}>
                <Text strong>Phone:</Text> <Text>{project.technicalManager?.phone || "N/A"}</Text>
              </Flex>

              <Flex vertical gap={16}>
                <Text strong>Joined:</Text> <Text> {formatDateWithoutTime(project.technicalManager?.createdAt)} </Text>
              </Flex>
            </div>
          </Flex>
        </Card>
      )}
    </div>
  );
};

export default ProjectDetails;
