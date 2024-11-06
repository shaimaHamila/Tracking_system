import { notification } from "antd";
import { useState } from "react";
import UserTable from "../../components/organisms/Tables/UsersTable/UsersTable";
import { User } from "../../types/User";
import { useCreateUser, useDeleteUser, useFetchUsers, useUpdateUser } from "../../features/user/UserHooks";
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
  const [pageSize, setPageSize] = useState(10);
  const [roleId, setRoleId] = useState<RolesId | null>(null); // Default to no specific role
  const [userName, setUserName] = useState<string | null>(null);
  const [clickedUser, setClickedUser] = useState<Partial<User> | null>(null);
  const { data, status, isError } = useFetchUsers({
    pageSize,
    page,
    roleId,
    userName,
  });
  const createUserMutation = useCreateUser(); //TODO   handle loading and fetch users after creating oe updating or deleting user
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = (user: Partial<User>) => {
    console.log("User created:", user);
    createUserMutation.mutate(user);
    setCreateUserDrawerOpen(false);
  };
  const handleUpdatedUser = (user: Partial<User>) => {
    console.log("User updated:", user);
    updateUserMutation.mutate({ id: clickedUser?.id!, userData: user });
    setUpdateUserDrawerOpen(false);
  };
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
        onCreateUserDrawerOpen={() => {
          setCreateUserDrawerOpen(true);
        }}
        onViewUser={(user) => {
          setClickedUser(user);
          setViewUserDrawerOpen(true);
        }}
        onUpdateUser={(user) => {
          console.log(user);
          setClickedUser(user);
          setUpdateUserDrawerOpen(true);
        }}
        onDeleteUser={(id) => {
          console.log(id);
          deleteUserMutation.mutate(id);
        }}
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
          setUserName(searchedName === "" ? null : searchedName);
        }}
        onRoleFilterChange={(selectedRoleId: RoleId | null) => {
          setRoleId(selectedRoleId);
          console.log(selectedRoleId);

          setPage(1); // Reset to the first page when role changes
        }}
      />

      <DrawerComponent
        isOpen={isCreateUserDrawerOpen}
        handleClose={() => setCreateUserDrawerOpen(false)}
        title={"Create User"}
        content={<CreateUserForm onCreateUser={(user) => handleCreateUser(user)} />}
      />
      <DrawerComponent
        isOpen={isUpdateUserDrawerOpen}
        handleClose={() => setUpdateUserDrawerOpen(false)}
        title={"Update User"}
        content={<UpdateUserForm user={clickedUser!} onUpdateUser={(user) => handleUpdatedUser(user)} />}
      />

      <DrawerComponent
        isOpen={isViewUserDrawerOpen}
        handleClose={() => {
          setViewUserDrawerOpen(false), setClickedUser(null);
        }}
        title={"User Details"}
        content={<UserDetails user={clickedUser} />}
      />
    </>
  );
};

export default Users;
