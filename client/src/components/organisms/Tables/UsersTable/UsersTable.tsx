import React from "react";
import { Space, Table } from "antd";
import type { TableProps } from "antd";
import TableHeader from "../../Headers/TableHeader/TableHeader";
import { Role } from "../../../../types/Role";
import { Project } from "../../../../types/Project";

interface DataType {
  key: string;
  name: string;
  email: string;
  role: Role;
  projects: Partial<Project>[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Projects",
    key: "projects",
    dataIndex: "projects",
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space size='middle'>
        <a>View</a>
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const UserTable: React.FC = () => {
  return (
    <div>
      <TableHeader
        onSearchChange={(searchedId) => console.log(searchedId)}
        onClickBtn={() => console.log("clicked")}
        btnText={"Add user"}
        totalItems={10}
        totalItemsText={"Total users:"}
        searchPlaceholder={"Search by name"}
      />
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default UserTable;

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    email: "test@gmail.com",
    role: {
      id: 2,
      roleName: "ADMIN",
    },
    projects: [],
  },
  {
    key: "2",
    name: "Jim Green",
    email: "test@gmail.com",

    role: {
      id: 3,
      roleName: "STAFF",
    },
    projects: [],
  },
  {
    key: "3",
    name: "Joe Black",
    email: "test@gmail.com",
    role: {
      id: 4,
      roleName: "CLIENT",
    },
    projects: [],
  },
];
