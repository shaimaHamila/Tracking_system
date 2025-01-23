import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { Notification } from "../types/Notification";
import { useQueryClient } from "@tanstack/react-query";

// Create a context for Socket
export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  const context = useContext(CurrentUserContext);

  var currentUserId = context?.currentUserContext?.id;

  const token = localStorage.getItem("accessToken");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentUserId) {
      // Create a new socket connection
      const newSocketConnection = io(import.meta.env.VITE_BASE_URL, {
        auth: { token },
      });

      // Handle socket events
      newSocketConnection.on("connect", () => {
        newSocketConnection.emit("joinRoom");

        // Handle new notifications
        newSocketConnection.on("newNotification", (notification: Notification) => {
          // Use the custom hook to add the notification
          console.log("notificationnnnnnnnnnnnnnnnnnnnnn", notification);
          queryClient.invalidateQueries({ queryKey: ["notification/fetchNotifications"] });
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
