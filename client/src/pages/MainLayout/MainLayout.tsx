import { useEffect, useState } from "react";
import SideBar from "../../components/organisms/SideBar/SideBar";
import { adminMenuItems, MenuItems } from "./MenuItems";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import colors from "../../styles/colors/colors";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/organisms/NavBar/NavBar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 900 ? true : false);
  const [pageName, setPageName] = useState<string>("");
  const [pageIcon, setPageIcon] = useState<any>(<></>);
  const location = useLocation();
  useEffect(() => {
    const getPageDetails = () => {
      const path = location.pathname;
      const currentPage = MenuItems.find((item) => item.key === path);
      if (currentPage) {
        setPageName(`${currentPage.label} ${"page"}`);
        setPageIcon(currentPage.icon);
      } else {
        setPageName("");
        setPageIcon(<></>);
      }
    };
    getPageDetails();
  }, [location.pathname]);
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
        <NavBar logout={handleLogout} userName={`Me`} pageName={pageName} userImg='' pageIcon={pageIcon} />
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
