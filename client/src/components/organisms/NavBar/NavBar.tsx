import { Header } from "antd/es/layout/layout";
import "./NavBar.scss";
import { Avatar, Dropdown, Flex, Menu } from "antd";
import React from "react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import Notification from "../../molecules/Notification/Notification";
import { RiArrowDropDownLine } from "react-icons/ri";
interface NavBarProps {
  userImg?: string;
  userName: string;
  pageName: string;
  pageIcon?: React.ReactNode;
  logout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ userImg, userName, pageName, pageIcon, logout }: NavBarProps) => {
  const menu = (
    <Menu>
      <Menu.Item key='profile' icon={<FaUser />}>
        <a href='/profile'>{userName ? userName : "Mon profil"}</a>
      </Menu.Item>
      <Menu.Item key='logout' icon={<FaSignOutAlt />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className='header-container'>
      <div>
        <div className='header--page-label'>
          <span className='header--page-label-icon'>{pageIcon}</span>
          <h4 className='header--page-label--title'>{pageName}</h4>
        </div>
      </div>

      <div className='header--right-section'>
        <Notification />

        <Dropdown overlay={menu} trigger={["click"]}>
          <div className='header--user' style={{ cursor: "pointer" }}>
            <Flex align='center'>
              <h3 className='header--user-name'>Me</h3>
              <RiArrowDropDownLine />
            </Flex>
            <Avatar
              icon={<FaUser />}
              src={userImg}
              size={34}
              style={{ backgroundColor: "#f3eae2", color: "#755c42" }}
            />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default NavBar;
