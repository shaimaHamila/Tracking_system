import { notification, Tabs, TabsProps } from "antd";
import { LiaUser, LiaUserCogSolid, LiaUserTieSolid } from "react-icons/lia";
import UserTable from "../../components/organisms/Tables/UsersTable/UsersTable";
import { User } from "../../types/User";
import { useFetchUsers } from "../../features/user/UserHooks";
import { useState } from "react";
const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data, status, isError } = useFetchUsers({
    pageSize,
    page,
  });
  console.log("Fetched data:", data);

  if (isError) {
    notification.error({
      message: "Failed to fetch users please try again",
    });
  }

  const onChange = (key: string) => {
    console.log(key);
  };
  const renderUserTable = (addBtnText: string) => (
    <UserTable
      users={data?.data || []}
      status={status}
      totalUsers={data?.meta?.totalCount || 0}
      onViewUser={(user: User) => console.log(user)}
      onUpdateUser={(user: User) => console.log(user)}
      onDeleteUser={(id: string) => console.log(id)}
      limitUsersPerPage={pageSize}
      onPageChange={(newPage: number) => {
        setPage(newPage);
        console.log("Page changed to:", newPage);
      }}
      handlePageSizeChange={(newPageSize) => {
        setPageSize(newPageSize);
        setPage(1);
        console.log("Page size changed to:", newPageSize);
      }}
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
