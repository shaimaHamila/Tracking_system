import React, { useState } from "react";
import { Badge, Dropdown, Flex, Typography } from "antd";
import { IoNotifications } from "react-icons/io5";
import colors from "../../../styles/colors/colors";
import "./Notification.scss";

const { Text } = Typography;
import NotificationItems from "../../atoms/NotificationItem/NotificationItems";
interface UserItem {
  id: number;
  firstName: string;
  secondName: string;
  role: string;
  picture?: string;
  message: string;
  link?: string;
  isRead: boolean;
  timestamp: string; // Added timestamp for date and time
}

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<UserItem[]>([
    {
      id: 1,
      firstName: "John",
      secondName: "Doe",
      role: "Admin",
      message: "Assigned you a ticket",
      link: "/messages/1",
      isRead: true,
      timestamp: "2024-10-27 13:45",
    },
    {
      id: 2,
      firstName: "Jane",
      secondName: "Smith",
      role: "User",
      message: "Created new ticket",
      picture: "https://randomuser.me/api/portraits/women/2.jpg",
      link: "/profile",
      isRead: false,
      timestamp: "2024-10-27 13:45",
    },
    {
      id: 3,
      firstName: "Jane",
      secondName: "Smith",
      role: "User",
      message: "Created new ticket",
      picture: "https://randomuser.me/api/portraits/women/2.jpg",
      link: "/profile",
      isRead: false,
      timestamp: "2024-10-27 13:45",
    },
    {
      id: 4,
      firstName: "Jane",
      secondName: "Smith",
      role: "User",
      message: "Created new ticket",
      picture: "https://randomuser.me/api/portraits/women/2.jpg",
      link: "/profile",
      isRead: true,
      timestamp: "2024-10-27 13:45",
    },
    {
      id: 5,
      firstName: "Jane",
      secondName: "Smith",
      role: "User",
      message: "Created new ticket",
      picture: "https://randomuser.me/api/portraits/women/2.jpg",
      link: "/profile",
      isRead: true,
      timestamp: "2024-10-27 13:45",
    },
  ]);

  const notificationCount = notifications.length > 12 ? "+12" : notifications.length;

  const handleNotificationClick = (id: number, link?: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
    if (link) {
      window.location.href = link;
    }
  };

  const handleMarkAllAsRead = () => {
    console.log("All notifications marked as read");
  };

  return (
    <Dropdown
      dropdownRender={() => (
        <NotificationItems
          notifications={notifications}
          notificationCount={notificationCount.toString()}
          handleNotificationClick={handleNotificationClick}
          handleMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
      trigger={["click"]}
      placement='bottomRight'
    >
      <Badge count={notificationCount} offset={[6, 1]} style={{ cursor: "pointer" }}>
        <Flex style={{ cursor: "pointer" }} gap={"0.25rem"}>
          <Text strong>Notifications</Text>
          <IoNotifications size={20} style={{ color: colors.secondary[500] }} />
        </Flex>
      </Badge>
    </Dropdown>
  );
};

export default Notification;
