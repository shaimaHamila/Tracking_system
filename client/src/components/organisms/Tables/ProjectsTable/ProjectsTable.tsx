import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Pagination, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import TableHeader from "../../Headers/TableHeader/TableHeader";
import { Project, ProjectType } from "../../../../types/Project";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { User } from "../../../../types/User";
import "./ProjectsTable.scss";
import { RoleName } from "../../../../types/Role";
import ProjectTypeTag from "../../../atoms/ProjectTypeTag/ProjectTypeTag";
interface ProjectsTableRow {
  id: number;
  name: string;
  createdAt: string;
  managers: User[];
  client: User;
  projectType: ProjectType;
  project: Project;
}
interface ProjectsTableProps {
  projects: Project[];
  currentUserRole: string;
  status: "error" | "success" | "pending";
  totalProjects: number;
  onCreateProjectDrawerOpen: () => void;
  onViewProject: (user: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: number) => void;
  limitProjectsPerPage: number;
  onPageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  addBtnText: string;
  onSearchChange: (searchedName: string) => void;
  onProjectTypeFilterChange: (projectType: ProjectType | null) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  currentUserRole,
  totalProjects,
  onDeleteProject,
  onUpdateProject,
  onViewProject,
  onPageChange,
  onSearchChange,
  addBtnText,
  onCreateProjectDrawerOpen,
  handlePageSizeChange,
  limitProjectsPerPage,
  status,
  onProjectTypeFilterChange,
}) => {
  const [pageSize, setPageSize] = useState<number>(limitProjectsPerPage);
  const [tableContent, setTableContent] = useState<ProjectsTableRow[]>([]);

  useEffect(() => {
    // Extract specific fields from orders and populate tableContent
    const _tableContent = projects?.map((project) => ({
      id: project?.id!,
      name: project?.name,
      client: project?.client,
      managers: project?.managers,
      createdAt: project?.createdAt,
      projectType: project?.projectType,
      project: project,
    }));
    setTableContent(_tableContent);
  }, [projects]);

  const handleProjectTypeFilterChange = (projectType: ProjectType | null) => {
    onProjectTypeFilterChange(projectType); // Trigger data fetch or update based on selected role
  };

  const columns: TableProps<ProjectsTableRow>["columns"] = [
    {
      title: "",
      key: "number",
      width: 50,
      render: (_, _record, index) => index + 1,
    },
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (text) => <>{text}</>,
    },
    // Conditionally render 'Client' column
    ...(currentUserRole !== RoleName.TECHNICAL_MANAGER
      ? [
          {
            title: "Client",
            dataIndex: "client",
            key: "client",
            width: 180,
            render: (client: Partial<User>) => (
              <>{client?.firstName && client?.lastName ? client?.firstName + " " + client?.lastName : "--"}</>
            ),
          },
        ]
      : []),
    ...(currentUserRole !== RoleName.CLIENT
      ? [
          {
            title: "Project Type",
            dataIndex: "projectType",
            key: "projectType",
            width: 150,
            filters: [
              { text: "External projects", value: ProjectType.EXTERNAL },
              { text: "Internal projects", value: ProjectType.INTERNAL },
              { text: "All projects", value: "null" },
            ],
            filterMultiple: false,
            filterOnClose: true,

            onFilter: (value: any, record: any) => {
              if (value === "null" || value === undefined) {
                handleProjectTypeFilterChange(null);
                return true; // Return true to show all rows
              }
              if (value) handleProjectTypeFilterChange(value as ProjectType);
              return record.projectType === value;
            },
            render: (projectType: any) => <ProjectTypeTag projectTypeTag={projectType} />,
          },
        ]
      : []),
    ...(currentUserRole !== RoleName.TECHNICAL_MANAGER
      ? [
          {
            title: <div>Project Managers</div>,
            key: "managers",
            dataIndex: "managers",
            width: 250,

            render: (managers: Partial<User>[]) => {
              // Check if there are no manager

              if (managers.length == 0) {
                return <div>--</div>;
              } else {
                const displayedManagers = managers.slice(0, 3);
                const remainingManagers = managers.length - displayedManagers.length;
                return (
                  <div className='projects-table--managers'>
                    {displayedManagers.map((manager: Partial<User>) => (
                      <Tag
                        style={{
                          marginBottom: "5px",
                          marginRight: "5px",
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                        }}
                        bordered={false}
                        key={manager.id}
                        color='default'
                      >
                        {manager?.firstName + " " + manager?.lastName}
                      </Tag>
                    ))}
                    {remainingManagers > 0 && (
                      <Tooltip title={projects.map((project: Partial<Project>) => project.name).join(", ")}>
                        <Tag bordered={false} color='default'>
                          +{remainingManagers} more
                        </Tag>
                      </Tooltip>
                    )}
                  </div>
                );
              }
            },
          },
        ]
      : []),
    {
      title: "Action",
      key: "action",
      width: 150,

      render: (project) => (
        <Space size='middle'>
          <Tooltip title='View'>
            <Button
              onClick={() => {
                onViewProject(project.project);
              }}
              className='table--action-btn'
              icon={<HiOutlineEye />}
            />
          </Tooltip>
          {/* Conditionally render 'Edit' and 'Update' buttons */}
          {currentUserRole === RoleName.ADMIN && (
            <>
              <Tooltip title='Edit'>
                <Button
                  onClick={() => onUpdateProject(project.project)}
                  className='table--action-btn'
                  icon={<HiOutlinePencilAlt />}
                />
              </Tooltip>
              <Tooltip title='Delete'>
                <Popconfirm
                  title='Are you sur you want to delete this Project?'
                  onConfirm={() => {
                    // store.dispatch(setLoading(true));
                    onDeleteProject(project.id!);
                  }}
                >
                  <Button className='table--action-btn' icon={<HiOutlineTrash />} loading={false} />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const onPageSizeChange = (_current: number, size: number) => {
    setPageSize(size);
    handlePageSizeChange(size);
  };
  const [tableHeight, setTableHeight] = useState(300);
  const projectTabRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (projectTabRef.current) {
      const { top } = projectTabRef.current.getBoundingClientRect();
      // Adjust TABLE_HEADER_HEIGHT according to your actual header height.
      const TABLE_HEADER_HEIGHT = 160;
      setTableHeight(window.innerHeight - top - TABLE_HEADER_HEIGHT - 100);
    }
  }, [projectTabRef]);
  return (
    <div ref={projectTabRef} style={{ overflow: "auto" }}>
      <TableHeader
        onSearchChange={(searchedName) => onSearchChange(searchedName)}
        onClickBtn={onCreateProjectDrawerOpen}
        btnText={addBtnText}
        totalItems={totalProjects}
        totalItemsText={"Total projects:"}
        searchPlaceholder={"Search by project name"}
        withBtn={currentUserRole === RoleName.ADMIN}
      />
      <Table<ProjectsTableRow>
        loading={status == "pending"}
        rowKey='id'
        columns={columns}
        dataSource={tableContent}
        pagination={false}
        scroll={{ y: tableHeight, x: "max-content" }}
      />
      <Pagination
        style={{ margin: "26px", textAlign: "right", justifyContent: "flex-end" }}
        total={totalProjects}
        pageSize={pageSize}
        showSizeChanger
        showTotal={(total, range) => `${range[0]}-${range[1]} ${"of"} ${total} ${"Projects"}`}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default ProjectsTable;
