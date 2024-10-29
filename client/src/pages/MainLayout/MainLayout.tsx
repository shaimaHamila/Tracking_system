import { useState } from "react";
import SideBar from "../../components/organisms/SideBar/SideBar";
import { adminMenuItems } from "./MenuItems";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import colors from "../../styles/colors/colors";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/organisms/NavBar/NavBar";
import { RxDashboard } from "react-icons/rx";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 900 ? true : false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "login";
    window.location.reload();
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <SideBar
        menuItems={adminMenuItems}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        width={245}
      />

      <Layout style={{ marginLeft: !collapsed ? "245px" : "60px" }}>
        <NavBar logout={handleLogout} userName={`Me`} pageName={"pageName"} userImg='' pageIcon={<RxDashboard />} />
        <Content style={{ margin: "12px" }}>
          <div
            style={{
              padding: 22,
              background: colors.white,
              borderRadius: "4px",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
