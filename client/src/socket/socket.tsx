import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { Notification } from "../types/Notification";
import { useAddNotificationFromSocket } from "../features/notification/NotificationHooks";

// Create a context for Socket
export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const context = useContext(CurrentUserContext);
  var currentUserId = context?.currentUserContext?.id;
  const token = localStorage.getItem("token");
  // Use the custom hook to add notifications
  const addNotification = useAddNotificationFromSocket;
  console.log("currentUserId", currentUserId);
  useEffect(() => {
    if (currentUserId) {
      // Create a new socket connection
      const newSocketConnection = io(import.meta.env.VITE_BACKEND_URL, {
        auth: { token },
      });

      // Handle socket events
      newSocketConnection.on("connect", () => {
        newSocketConnection.emit("joinRoom");
        console.log("Connected to the socket server");

        // Handle new notifications
        newSocketConnection.on("newNotification", (notification: Notification) => {
          // Use the custom hook to add the notification
          console.log("notificationnnnnnnnnnnnnnnnnnnnnn");
          addNotification(notification);
          console.log("New notificationnnnnnnnnnnnnnnnnnnnnn", notification);
        });
      });

      if (socketInstance) {
        socketInstance.disconnect();
      }
      // Set the new socket instance
      setSocketInstance(newSocketConnection);
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [currentUserId]);

  return <SocketContext.Provider value={socketInstance}>{children}</SocketContext.Provider>;
};
