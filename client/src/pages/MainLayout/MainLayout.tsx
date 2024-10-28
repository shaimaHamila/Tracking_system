import { useState } from "react";
import SideBar from "../../components/organisms/SideBar/SideBar";
import { adminMenuItems } from "./MenuItems";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 900 ? true : false);
  return (
    <div>
      <SideBar
        menuItems={adminMenuItems}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        width={245}
      />
    </div>
  );
};

export default MainLayout;
