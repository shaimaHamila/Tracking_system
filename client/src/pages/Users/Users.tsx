import { Tabs, TabsProps } from "antd";
import { LiaUser, LiaUserCogSolid, LiaUserTieSolid } from "react-icons/lia";
import UserTable from "../../components/organisms/Tables/UsersTable/UsersTable";
const Users = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Staff",
      children: <UserTable />,
      icon: <LiaUser />,
    },
    {
      key: "2",
      label: "Clients",
      children: "Clients",
      icon: <LiaUserTieSolid />,
    },
    {
      key: "3",
      label: "Tech Managers",
      children: "Tech Managers",
      icon: <LiaUserCogSolid />,
    },
  ];
  return <Tabs defaultActiveKey='1' items={items} onChange={onChange} />;
};

export default Users;
