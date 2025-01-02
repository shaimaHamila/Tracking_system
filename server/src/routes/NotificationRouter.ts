import express from "express";
import { authentication } from "../middlewares/authMiddleware";
import { allRoleAuthorization } from "../middlewares/checkUserRole";
import {
  getNotifications,
  markAllUserNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/NotificationController";

const NotificationRouter = express.Router();

NotificationRouter.get(
  "/",
  authentication,
  allRoleAuthorization,
  getNotifications
);
NotificationRouter.post(
  "/:id",
  authentication,
  allRoleAuthorization,
  markNotificationAsRead
);
NotificationRouter.put(
  "/mark-all-as-read",
  authentication,
  allRoleAuthorization,
  markAllUserNotificationsAsRead
);
export default NotificationRouter;
