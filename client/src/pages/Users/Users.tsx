import { notification } from "antd";
import { useState } from "react";
import UserTable from "../../components/organisms/Tables/UsersTable/UsersTable";
import { User } from "../../types/User";
import { useFetchUsers } from "../../features/user/UserHooks";
import { RoleId, RolesId } from "../../types/Role";
import DrawerComponent from "../../components/molecules/Drawer/DrawerComponent";
import CreateUserForm from "../../components/templates/forms/CreateUserForm/CreateUserForm";
import UpdateUserForm from "../../components/templates/forms/UpdateUserForm/UpdateUserForm";
import UserDetails from "../../components/templates/UserDetails/UserDetails";

const Users: React.FC = () => {
  const [isCreateUserDrawerOpen, setCreateUserDrawerOpen] = useState(false);
  const [isUpdateUserDrawerOpen, setUpdateUserDrawerOpen] = useState(false);
  const [isViewUserDrawerOpen, setViewUserDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [roleId, setRoleId] = useState<RolesId | null>(null); // Default to no specific role
  const [firstName, setFirstName] = useState<string | null>(null);
  const [clickedUser, setClickedUser] = useState<Partial<User> | null>(null);
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
        onCreateUser={() => {
          console.log("Add new user");
          setCreateUserDrawerOpen(true);
        }}
        onViewUser={(user) => {
          console.log(user);
          setClickedUser(user);
          setViewUserDrawerOpen(true);
        }}
        onUpdateUser={(user) => {
          console.log(user);
          setUpdateUserDrawerOpen(true);
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
        isOpen={isCreateUserDrawerOpen}
        handleClose={() => setCreateUserDrawerOpen(false)}
        title={"Create User"}
        content={<CreateUserForm onCreateUser={(user) => console.log(user)} />}
      />
      <DrawerComponent
        isOpen={isUpdateUserDrawerOpen}
        handleClose={() => setUpdateUserDrawerOpen(false)}
        title={"Update User"}
        content={<UpdateUserForm onUpdateUser={(user) => console.log(user)} />}
      />

      <DrawerComponent
        isOpen={isViewUserDrawerOpen}
        handleClose={() => setViewUserDrawerOpen(false)}
        title={"Create User"}
        content={<UserDetails user={clickedUser} />}
      />
    </>
  );
};

export default Users;
