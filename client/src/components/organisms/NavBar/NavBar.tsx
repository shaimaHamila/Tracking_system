import { Header } from "antd/es/layout/layout";
import "./NavBar.scss";
import { Avatar, Dropdown, Menu } from "antd";
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
        <a href='/profile'>View My Profile</a>
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
        {/* Notification Icon */}
        <Notification />

        {/* User Dropdown */}
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className='header--user' style={{ cursor: "pointer" }}>
            <h3 className='header--user-name'>
              {userName ? userName : "Mon profil"}
              <RiArrowDropDownLine />
            </h3>
            {userImg ? (
              <Avatar src={userImg} size={34} style={{ backgroundColor: "#fde3cf", color: "#f56a00" }} />
            ) : (
              <Avatar icon={<FaUser />} size={34} style={{ backgroundColor: "#fde3cf", color: "#f56a00" }} />
            )}
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default NavBar;
