import { Avatar, List, Button, Typography, Flex } from "antd";

import colors from "../../../styles/colors/colors";
import "./NotificationItems.scss";
import Title from "antd/es/typography/Title";
import { MdOutlineDoneAll } from "react-icons/md";

import { formatDate } from "../../../helpers/date";
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
interface NotificationItemsProps {
  notifications: UserItem[];
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
          renderItem={(item) => (
            <List.Item
              className='notifications-list'
              key={item.id}
              onClick={() => handleNotificationClick(item.id, item.link)}
              style={{
                backgroundColor: item.isRead ? "transparent" : `${colors.gray[50]}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = item.isRead ? "#f5f5f5" : `${colors.gray[100]}`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = item.isRead ? "transparent" : `${colors.gray[50]}`)
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar size={38} style={{ backgroundColor: "#f3eae2", color: "#755c42" }}>
                    <Text strong style={{ display: "flex", justifyContent: "center" }}>
                      {item?.firstName?.substring(0, 2).toUpperCase()}
                    </Text>
                  </Avatar>
                }
                title={<span>{`${item.firstName} ${item.secondName} ${item.message}`}</span>}
                description={
                  <Flex gap={"4px"} vertical>
                    <Text type='secondary'>Role: {item.role}</Text>

                    <Text type='secondary'>{formatDate(item.timestamp)}</Text>
                  </Flex>
                }
              />
              {!item.isRead && <span style={{ color: colors.red[400], fontSize: "18px", fontWeight: "bold" }}>●</span>}
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
