import { notification } from "antd";
import { useState } from "react";
import UserTable from "../../components/organisms/Tables/UsersTable/UsersTable";
import { User } from "../../types/User";
import { useFetchUsers } from "../../features/user/UserHooks";
import { RoleId, RolesId } from "../../types/Role";
import DrawerComponent from "../../components/molecules/Drawer/DrawerComponent";
import CreateUserForm from "../../components/templates/forms/CreateUserForm/CreateUserForm";

const Users: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [roleId, setRoleId] = useState<RolesId | null>(null); // Default to no specific role
  const [firstName, setFirstName] = useState<string | null>(null);

  const { data, status, isError } = useFetchUsers({
    pageSize,
    page,
    roleId,
    firstName,
  });

  if (isError) {
    notification.error({
      message: "Failed to fetch users, please try again",
    });
  }

  return (
    <>
      <UserTable
        users={data?.data || []}
        status={status}
        totalUsers={data?.meta?.totalCount || 0}
        onViewUser={(user: User) => {
          console.log(user);
          setIsDrawerOpen(true);
        }}
        onUpdateUser={(user: User) => {
          console.log(user);
          setIsDrawerOpen(true);
        }}
        onDeleteUser={(id: string) => console.log(id)}
        limitUsersPerPage={pageSize}
        onPageChange={(newPage: number) => {
          setPage(newPage);
        }}
        handlePageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        addNewUser={() => {
          console.log("Add new user");
          setIsDrawerOpen(true);
        }}
        addBtnText={"Add new user"}
        onSearchChange={(searchedName: string) => {
          setFirstName(searchedName === "" ? null : searchedName);
        }}
        onRoleFilterChange={(selectedRoleId: RoleId | null) => {
          setRoleId(selectedRoleId);
          setPage(1); // Reset to the first page when role changes
        }}
      />
      <DrawerComponent
        isOpen={isDrawerOpen}
        handleClose={() => setIsDrawerOpen(false)}
        title={"Create User"}
        content={<CreateUserForm />}
      />
    </>
  );
};

export default Users;
