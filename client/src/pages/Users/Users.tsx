import { Tabs, TabsProps } from "antd";
import { LiaUser, LiaUserCogSolid, LiaUserTieSolid } from "react-icons/lia";
import UserTable from "../../components/organisms/Tables/UsersTable/UsersTable";
import { User } from "../../types/User";
const Users = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  const renderUserTable = (addBtnText: string) => (
    <UserTable
      users={data}
      status={"idle"}
      totalUsers={0}
      onViewUser={(user: User) => console.log(user)}
      onUpdateUser={(user: User) => console.log(user)}
      onDeleteUser={(id: string) => console.log(id)}
      limitUsersPerPage={10}
      onPageChange={(page: number) => console.log(page)}
      handlePageSizeChange={(current: number, pageSize) => console.log(current, pageSize)}
      addNewUser={() => console.log(`Add new ${addBtnText.toLowerCase()}`)}
      addBtnText={addBtnText}
      onSearchChange={(searchedName: string) => console.log(searchedName)}
    />
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Staff",
      icon: <LiaUser />,
      children: renderUserTable("Add new staff"),
    },
    {
      key: "2",
      label: "Clients",
      icon: <LiaUserTieSolid />,
      children: renderUserTable("Add new client"),
    },
    {
      key: "3",
      label: "Tech Managers",
      icon: <LiaUserCogSolid />,
      children: renderUserTable("Add new tech manager"),
    },
    {
      key: "4",
      label: "Admins",
      icon: <LiaUserCogSolid />,
      children: renderUserTable("Add new admin"),
    },
  ];
  return <Tabs defaultActiveKey='1' items={items} onChange={onChange} />;
};

export default Users;

const data: any[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Brown",
    email: "test@gmail.com",
    role: {
      id: 2,
      roleName: "ADMIN",
    },
    projects: [{ id: 1, name: "Project 1" }],
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Brown",
    email: "test@gmail.com",

    role: {
      id: 3,
      roleName: "STAFF",
    },
    projects: [
      { id: 1, name: "Project 1" },
      { id: 2, name: "Project 2" },
      { id: 3, name: "Project 3" },
      { id: 4, name: "Project 4" },
      { id: 4, name: "Project 5" },
      { id: 4, name: "Project 6" },
      { id: 4, name: "Project 7" },
    ],
  },
  {
    id: 3,
    firstName: "John",
    lastName: "Brown",
    email: "test@gmail.com",
    role: {
      id: 4,
      roleName: "CLIENT",
    },
    projects: [
      { id: 1, name: "Project 1" },
      { id: 2, name: "Project 2" },
    ],
  },
];
