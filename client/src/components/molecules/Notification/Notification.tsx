import React, { useState } from "react";
import { Badge, Dropdown, List } from "antd";
import { FaBell } from "react-icons/fa";

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have a new message" },
    { id: 2, message: "Your profile was viewed" },
    { id: 3, message: "New comment on your post" },
    { id: 4, message: "System update available" },
  ]);

  const notificationCount = notifications.length > 12 ? "+12" : notifications.length;

  const notificationMenu = (
    <div style={{ width: 300, padding: 10 }}>
      <List
        dataSource={notifications}
        renderItem={(item) => <List.Item>{item.message}</List.Item>}
        bordered
        locale={{ emptyText: "No notifications" }}
      />
    </div>
  );

  return (
    <Dropdown overlay={notificationMenu} trigger={["click"]} placement='bottomRight'>
      <Badge count={notificationCount} offset={[10, 0]}>
        <FaBell size={20} style={{ cursor: "pointer", color: "#000" }} />
      </Badge>
    </Dropdown>
  );
};

export default Notification;
