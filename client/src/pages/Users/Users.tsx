import { notification, Tabs, TabsProps } from "antd";
import { LiaUser, LiaUserCogSolid, LiaUserShieldSolid, LiaUserTieSolid } from "react-icons/lia";
import UserTable from "../../components/organisms/Tables/UsersTable/UsersTable";
import { User } from "../../types/User";
import { useFetchUsers } from "../../features/user/UserHooks";
import { useState } from "react";
import { RoleId, RolesId } from "../../types/Role";
import "./User.scss";
const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [roleId, setRoleId] = useState(RolesId.STAFF); // Default to STAFF
  const [firstName, setFirstName] = useState<string | null>(null);

  const { data, status, isError } = useFetchUsers({
    pageSize,
    page,
    roleId,
    firstName,
  });

  if (isError) {
    notification.error({
      message: "Failed to fetch users please try again",
    });
  }
  // Map tab keys to role IDs
  const roleMap: Record<string, RoleId> = {
    "1": RolesId.STAFF,
    "2": RolesId.CLIENT,
    "3": RolesId.TECHNICAL_MANAGER,
    "4": RolesId.ADMIN,
  };
  const onChange = (key: string) => {
    const newRoleId = roleMap[key];
    setRoleId(newRoleId);
    setPage(1); // Reset to the first page when role changes
    setFirstName(null); // Reset search
    console.log("Selected role ID:", newRoleId);
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
      }}
      handlePageSizeChange={(newPageSize) => {
        setPageSize(newPageSize);
        setPage(1);
      }}
      addNewUser={() => console.log(`Add new ${addBtnText.toLowerCase()}`)}
      addBtnText={addBtnText}
      onSearchChange={(searchedName: string) => {
        setFirstName(searchedName == "" ? null : searchedName);
      }}
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
      icon: <LiaUserShieldSolid />,
      children: renderUserTable("Add new admin"),
    },
  ];
  return <Tabs defaultActiveKey='1' items={items} onChange={onChange} />;
};

export default Users;
