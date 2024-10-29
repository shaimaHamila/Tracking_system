import { FileTextOutlined } from "@ant-design/icons";
import { GoProject, GoTasklist } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { LuUsers } from "react-icons/lu";
import { FaLaptopCode } from "react-icons/fa";
export const staffMenuItems = [
  { key: "/dashboard", label: "Tableau de bord", icon: <FileTextOutlined /> },
  { key: "/tickets", label: "Liste des livreurs", icon: <FileTextOutlined /> },

  // Add new staff menu items here
];
export const clientMenuItems = [
  { key: "/dashboard", label: "Tableau de bord", icon: <FileTextOutlined /> },
  { key: "/tickets", label: "Liste des livreurs", icon: <FileTextOutlined /> },
  // Add new client menu items here
];
export const techManagerMenuItems = [
  { key: "/dashboard", label: "Tableau de bord", icon: <FileTextOutlined /> },
  { key: "/tickets", label: "Liste des livreurs", icon: <FileTextOutlined /> },
  // Add new client menu items here
];
export const adminMenuItems = [
  { key: "/dashboard", label: "Dashboard", icon: <RxDashboard /> },
  { key: "/projects", label: "Projects", icon: <GoProject /> },
  { key: "/users", label: "Users", icon: <LuUsers /> },
  { key: "/tickets", label: "Tickets", icon: <GoTasklist /> },
  { key: "/equipments", label: "Equipments", icon: <FaLaptopCode /> },
  // Add new Admin menu items here
];
