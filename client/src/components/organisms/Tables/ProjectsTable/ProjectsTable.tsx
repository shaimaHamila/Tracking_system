import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Pagination, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import TableHeader from "../../Headers/TableHeader/TableHeader";
import { Project, ProjectType } from "../../../../types/Project";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { User } from "../../../../types/User";
import "./ProjectsTable.scss";
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
  status: "error" | "success" | "pending";
  totalProjects: number;
  onCreateProjectDrawerOpen: () => void;
  onViewProject: (user: User) => void;
  onUpdateProject: (user: User) => void;
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <>{text}</>,
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (client: Partial<User>) => <>{client?.firstName + " " + client?.lastName}</>,
    },
    {
      title: "Project Type",
      dataIndex: "projectType",
      key: "projectType",
      filters: [
        { text: "External projects", value: ProjectType.EXTERNAL },
        { text: "Internal projects", value: ProjectType.INTERNAL },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (!value) handleProjectTypeFilterChange(null);
        return record.projectType === value;
      },

      render: (projectType) => {
        return <Tag>{projectType}</Tag>;
      },
    },
    {
      title: "Project Managers",
      key: "managers",
      dataIndex: "managers",
      render: (managers) => {
        // Check if there are no manager

        if (managers.length == 0) {
          return <div>--</div>;
        } else {
          const displayedManagers = managers.slice(0, 3);
          const remainingManagers = managers.length - displayedManagers.length;
          return (
            <div style={{ marginRight: "1rem" }}>
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

    {
      title: "Action",
      key: "action",
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
          <Tooltip title='Edit'>
            <Button
              onClick={() => {
                onUpdateProject(project.project);
              }}
              className='table--action-btn'
              icon={<HiOutlinePencilAlt />}
            />
          </Tooltip>

          <Tooltip title='Delete'>
            <Popconfirm
              title='Are you sur you want to delete this user?'
              onConfirm={() => {
                // store.dispatch(setLoading(true));
                onDeleteProject(project.id!);
              }}
            >
              <Button className='table--action-btn' icon={<HiOutlineTrash />} loading={false} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const onPageSizeChange = (_current: number, size: number) => {
    setPageSize(size);
    handlePageSizeChange(size);
  };
  const [tableHeight, setTableHeight] = useState(300);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const { top } = ref.current.getBoundingClientRect();
      // Adjust TABLE_HEADER_HEIGHT according to your actual header height.
      const TABLE_HEADER_HEIGHT = 160;
      setTableHeight(window.innerHeight - top - TABLE_HEADER_HEIGHT - 100);
    }
  }, [ref]);
  return (
    <div ref={ref} style={{ overflow: "auto" }}>
      <TableHeader
        onSearchChange={(searchedName) => onSearchChange(searchedName)}
        onClickBtn={onCreateProjectDrawerOpen}
        btnText={addBtnText}
        totalItems={totalProjects}
        totalItemsText={"Total users:"}
        searchPlaceholder={"Search by name"}
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
        showTotal={(total, range) => `${range[0]}-${range[1]} ${"of"} ${total} ${"Users"}`}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default ProjectsTable;
