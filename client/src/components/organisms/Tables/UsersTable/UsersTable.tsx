import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Pagination, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import TableHeader from "../../Headers/TableHeader/TableHeader";
import { Role, RoleId, RolesId } from "../../../../types/Role";
import { Project } from "../../../../types/Project";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { User } from "../../../../types/User";
import RoleTag from "../../../atoms/RoleTag/RoleTag";
import "./UsersTable.scss";
interface UserTableRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  projects: Partial<Project>[];
  user: User;
}
interface UserTableProps {
  users: User[];
  status: "error" | "success" | "pending";
  totalUsers: number;
  onCreateUserDrawerOpen: () => void;
  onViewUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: number) => void;
  limitUsersPerPage: number;
  onPageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  addBtnText: string;
  onSearchChange: (searchedName: string) => void;
  onRoleFilterChange: (roleId: RoleId | null) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  totalUsers,
  onDeleteUser,
  onUpdateUser,
  onViewUser,
  onPageChange,
  onSearchChange,
  addBtnText,
  onCreateUserDrawerOpen,
  handlePageSizeChange,
  limitUsersPerPage,
  status,
  onRoleFilterChange,
}) => {
  const [pageSize, setPageSize] = useState<number>(limitUsersPerPage);
  const [tableContent, setTableContent] = useState<UserTableRow[]>([]);

  useEffect(() => {
    // Extract specific fields from orders and populate tableContent
    const _tableContent = users?.map((user) => ({
      id: user?.id!,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      role: user?.role,
      projects: user?.projects,
      user: user,
    }));
    setTableContent(_tableContent);
  }, [users]);

  const handleRoleFilterChange = (roleId: RoleId | null) => {
    onRoleFilterChange(roleId); // Trigger data fetch or update based on selected role
  };

  const columns: TableProps<UserTableRow>["columns"] = [
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
      width: 160,
      render: (text) => <>{text}</>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      filters: [
        { text: "All", value: "null" },
        { text: "Admin", value: RolesId.ADMIN }, // Use RoleId values here
        { text: "Staff", value: RolesId.STAFF },
        { text: "Client", value: RolesId.CLIENT },
        { text: "Technical Manager", value: RolesId.TECHNICAL_MANAGER },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === "null" || value === undefined) {
          handleRoleFilterChange(null);
          return true; // Return true to show all rows
        }
        handleRoleFilterChange(value as RoleId);
        return record.role.id === value;
      },

      render: (role) => {
        return <RoleTag role={role} />;
      },
    },
    {
      title: "Projects",
      key: "projects",
      dataIndex: "projects",
      width: 280,
      render: (projects) => {
        // Check if there are no projects

        if (projects.length == 0) {
          return <div>--</div>;
        } else {
          const displayedProjects = projects.slice(0, 2);
          const remainingProjects = projects.length - displayedProjects.length;
          return (
            <div className='users-table--projects'>
              {displayedProjects.map((project: Partial<Project>) => (
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
                  key={project.id}
                  color='default'
                >
                  {project.name}
                </Tag>
              ))}
              {remainingProjects > 0 && (
                <Tooltip title={projects.map((project: Partial<Project>) => project.name).join(", ")}>
                  <Tag bordered={false} color='default'>
                    +{remainingProjects} more
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
      width: 200,
      render: (user) => (
        <Space size='middle'>
          <Tooltip title='View'>
            <Button
              onClick={() => {
                onViewUser(user?.user);
              }}
              className='table--action-btn'
              icon={<HiOutlineEye />}
            />
          </Tooltip>
          <Tooltip title='Edit'>
            <Button
              onClick={() => {
                onUpdateUser(user?.user);
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
                onDeleteUser(user.id!);
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
        onClickBtn={onCreateUserDrawerOpen}
        btnText={addBtnText}
        totalItems={totalUsers}
        totalItemsText={"Total users:"}
        searchPlaceholder={"Search by name"}
      />
      <Table<UserTableRow>
        loading={status == "pending"}
        rowKey='id'
        columns={columns}
        dataSource={tableContent}
        pagination={false}
        scroll={{ y: tableHeight, x: "max-content" }}
      />
      <Pagination
        style={{ margin: "26px", textAlign: "right", justifyContent: "flex-end" }}
        total={totalUsers}
        pageSize={pageSize}
        showSizeChanger
        showTotal={(total, range) => `${range[0]}-${range[1]} ${"of"} ${total} ${"Users"}`}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default UserTable;
