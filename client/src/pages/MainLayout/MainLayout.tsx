import { useContext, useEffect, useState } from "react";
import SideBar from "../../components/organisms/SideBar/SideBar";
import { ClientMenuItems, MenuItems, UserMenuItems } from "./MenuItems";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import colors from "../../styles/colors/colors";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/organisms/NavBar/NavBar";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { RoleName } from "../../types/Role";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 900 ? true : false);
  const [pageName, setPageName] = useState<string>("");
  const [pageIcon, setPageIcon] = useState<any>(<></>);
  const location = useLocation();
  const context = useContext(CurrentUserContext);
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
  let menuItems;
  switch (context?.currentUserContext?.role?.roleName) {
    case RoleName.ADMIN:
      menuItems = MenuItems;
      break;
    case RoleName.CLIENT:
      menuItems = ClientMenuItems;
      break;
    default:
      menuItems = UserMenuItems;
  }
  return (
    <Layout style={{ height: "100vh" }}>
      <SideBar menuItems={menuItems} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} width={245} />

      <Layout style={{ marginLeft: !collapsed ? "245px" : "60px" }}>
        <NavBar
          logout={handleLogout}
          firstName={context?.currentUserContext?.firstName}
          userName={context?.currentUserContext?.firstName!}
          pageName={pageName}
          userImg=''
          pageIcon={pageIcon}
        />
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
