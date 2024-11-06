import { FileTextOutlined } from "@ant-design/icons";
import { GoProject, GoTasklist } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { LuUsers } from "react-icons/lu";
import { BsPcDisplay } from "react-icons/bs";
export const staffMenuItems = [
  { key: "/dashboard", label: "Dashboard", icon: <FileTextOutlined /> },
  { key: "/tickets", label: "Tickets", icon: <FileTextOutlined /> },
  { key: "/projects", label: "Projects", icon: <GoProject /> },

  // Add new staff menu items here
];
export const clientMenuItems = [
  { key: "/dashboard", label: "Dashboard", icon: <FileTextOutlined /> },
  { key: "/projects", label: "Projects", icon: <GoProject /> },
  { key: "/tickets", label: "Tickets", icon: <FileTextOutlined /> },
  // Add new client menu items here
];
export const techManagerMenuItems = [
  { key: "/dashboard", label: "Dashboard", icon: <FileTextOutlined /> },
  { key: "/tickets", label: "Tickets", icon: <FileTextOutlined /> },
  { key: "/equipments", label: "Equipments", icon: <BsPcDisplay /> },
  { key: "/projects", label: "Projects", icon: <GoProject /> },

  // Add new client menu items here
];
export const adminMenuItems = [
  { key: "/dashboard", label: "Dashboard", icon: <RxDashboard /> },
  { key: "/users", label: "Users", icon: <LuUsers /> },
  { key: "/projects", label: "Projects", icon: <GoProject /> },
  { key: "/tickets", label: "Tickets", icon: <GoTasklist /> },
  { key: "/equipments", label: "Equipments", icon: <BsPcDisplay /> },
  // Add new Admin menu items here
];
export const MenuItems = [
  { key: "/dashboard", label: "Dashboard", icon: <RxDashboard /> },
  { key: "/users", label: "Users", icon: <LuUsers /> },
  { key: "/projects", label: "Projects", icon: <GoProject /> },
  { key: "/tickets", label: "Tickets", icon: <GoTasklist /> },
  { key: "/equipments", label: "Equipments", icon: <BsPcDisplay /> },
  // Add new Admin menu items here
];
