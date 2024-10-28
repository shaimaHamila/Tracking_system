import React, { useState } from "react";
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";

const { Sider } = Layout;
import "./SideBar.scss";
import { useLocation, useNavigate } from "react-router-dom";
type MenuItem = {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
};

interface SideMenuProps {
  menuItems: MenuItem[];
  collapsed: boolean;
  onCollapse: () => void;
  width: number;
}
const SideBar: React.FC<SideMenuProps> = ({ menuItems, collapsed, onCollapse, width }: SideMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  return (
    <Layout.Sider
      className='side-menu--container ant-layout-sider'
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapsedWidth='60'
      width={width}
    >
      <div className='side-menu'>
        <div className='side-menu--header'>
          <img
            className={`side-menu--header-logo${collapsed ? "-expanded" : ""}`}
            src={collapsed ? "../png/logo-icon.png" : "../png/logo-dark.png"}
            alt='Astrolab logo'
            style={{ maxWidth: collapsed ? "2rem" : "10rem", transition: "max-width 0.3s ease" }}
          />
        </div>
        <Menu
          selectedKeys={[selectedKey]}
          theme='dark'
          mode='inline'
          onClick={(item) => {
            navigate(item.key.toString());
            setSelectedKey(item.key.toString());
          }}
          items={menuItems as MenuProps["items"]}
          className='side-menu--menu'
        />
      </div>
    </Layout.Sider>
  );
};

export default SideBar;
