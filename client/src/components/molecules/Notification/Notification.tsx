import React, { useState } from "react";
import { Badge, Dropdown, Flex, Typography } from "antd";
import { IoNotifications } from "react-icons/io5";
import colors from "../../../styles/colors/colors";
import "./Notification.scss";

const { Text } = Typography;
import NotificationItems from "../../atoms/NotificationItem/NotificationItems";
import { useFetchNotifications } from "../../../features/notification/NotificationHooks";

const Notification: React.FC = () => {
  const { data: notifications } = useFetchNotifications({ pageSize: 10, page: 1 });
  console.log(notifications);
  let unseenNotifications = notifications?.meta?.unseenNotifications || 0;
  const notificationCount = unseenNotifications > 12 ? "+12" : unseenNotifications?.toString();

  const handleNotificationClick = (id: number, link?: string) => {
    // setNotifications((prevNotifications) =>
    //   prevNotifications.map((notification) =>
    //     notification.id === id ? { ...notification, isRead: true } : notification,
    //   ),
    // );
    // if (link) {
    //   window.location.href = link;
    // }
  };

  const handleMarkAllAsRead = () => {
    console.log("All notifications marked as read");
  };

  return (
    <Dropdown
      dropdownRender={() => (
        <NotificationItems
          notifications={notifications?.data || []}
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
