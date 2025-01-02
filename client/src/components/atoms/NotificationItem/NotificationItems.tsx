import { Avatar, List, Button, Typography, Flex } from "antd";

import colors from "../../../styles/colors/colors";
import "./NotificationItems.scss";
import Title from "antd/es/typography/Title";
import { MdOutlineDoneAll } from "react-icons/md";

import { formatDate } from "../../../helpers/date";
import { Notification } from "../../../types/Notification";

interface NotificationItemsProps {
  notifications: Notification[];
  notificationCount: string;
  handleNotificationClick: (id: number, link?: string) => void;
  handleMarkAllAsRead: () => void;
}
const { Text } = Typography;
const NotificationItems: React.FC<NotificationItemsProps> = ({
  notifications,
  notificationCount,
  handleNotificationClick,
  handleMarkAllAsRead,
}) => {
  return (
    <div className='notifications'>
      <div className='notifications-header'>
        <Title level={4} style={{ margin: "0" }}>
          Notifications
        </Title>
        <Text type='secondary'>Stay updated with your latest notifications</Text>
      </div>

      <div className='notifications-toolbar'>
        <Flex gap={"4px"}>
          <Text strong>All </Text>
          <Text type='secondary'> | </Text>
          <Text type='secondary'> Unread ({notificationCount})</Text>
        </Flex>
        <Button icon={<MdOutlineDoneAll />} type='link' onClick={handleMarkAllAsRead} style={{ padding: 0 }}>
          Mark All as Read
        </Button>
      </div>

      <div className='notifications-container'>
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              className='notifications-list'
              key={notification?.id}
              onClick={() => handleNotificationClick(notification?.id, notification?.referenceId)}
              style={{
                backgroundColor: notification.unread ? `${colors.gray[50]}` : "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = notification?.unread ? `${colors.gray[100]}` : "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = notification?.unread ? `${colors.gray[50]}` : "transparent")
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar size={38} style={{ backgroundColor: "#f3eae2", color: "#755c42" }}>
                    <Text strong style={{ display: "flex", justifyContent: "center" }}>
                      {notification?.sender?.firstName?.substring(0, 2).toUpperCase()}
                    </Text>
                  </Avatar>
                }
                title={
                  <span>
                    {notification?.message?.includes(":") ? (
                      <>
                        <span className='notification-label'>{`${notification.message.split(":")[0]}:`}</span>
                        <span className='notification-message'>{`${notification.message.split(":")[1]}`}</span>
                      </>
                    ) : (
                      <span>{notification?.message}</span>
                    )}
                  </span>
                }
                description={
                  <Flex gap={"4px"} vertical>
                    <Text type='secondary'>{formatDate(notification?.createdAt)}</Text>
                  </Flex>
                }
              />
              {notification?.unread && (
                <span style={{ color: colors.red[400], fontSize: "18px", fontWeight: "bold" }}>●</span>
              )}
            </List.Item>
          )}
          bordered={false}
          locale={{ emptyText: "No notifications" }}
        />
      </div>
    </div>
  );
};

export default NotificationItems;
