import React from "react";
import { Badge, Dropdown, Flex, Typography } from "antd";
import { IoNotifications } from "react-icons/io5";
import colors from "../../styles/colors/colors";
import "./Notification.scss";

const { Text } = Typography;
import NotificationItems from "../../components/atoms/NotificationItem/NotificationItems";
import {
  useFetchNotifications,
  useMarkAllUserNotificationsAsRead,
} from "../../features/notification/NotificationHooks";
import { NotificationType } from "../../types/Notification";

const Notification: React.FC = () => {
  const { data: notifications } = useFetchNotifications();
  const markAllUserNotificationsAsRead = useMarkAllUserNotificationsAsRead(); // Initialize mutation hook

  const unseenNotifications = notifications?.meta?.unseenNotifications || 0;
  const notificationCount = unseenNotifications > 12 ? "+12" : unseenNotifications?.toString();

  const handleNotificationClick = (_id: number, notificationType: NotificationType) => {
    if (notificationType === NotificationType.PROJECT_ASSIGNED) {
      window.location.href = "/projects";
    } else {
      window.location.href = "/tickets";
    }
  };
  const handleMarkAllAsRead = () => {
    console.log("All notifications marked as read");
  };

  const handleVisibleChange = (visible: boolean) => {
    if (!visible && unseenNotifications > 0) {
      markAllUserNotificationsAsRead.mutate();
    }
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
      onOpenChange={handleVisibleChange} // Call mutation when dropdown becomes visible
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
