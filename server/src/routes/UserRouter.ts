import express from "express";
import {
  createUser,
  deleteUser,
  fetchCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserPassword,
} from "../controllers/UserController";
import { authentication } from "../middlewares/authMiddleware";
import {
  adminAuthorization,
  allRoleAuthorization,
  userAuthorization,
} from "../middlewares/checkUserRole";
import { Role } from "../types/Roles";

const UserRouter = express.Router();

UserRouter.post("/", authentication, adminAuthorization, createUser);
UserRouter.get("/", authentication, allRoleAuthorization, getAllUsers);
UserRouter.get("/current-user", authentication, fetchCurrentUser);
UserRouter.get(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.STAFF, Role.TECHNICAL_MANAGER]),
  getUserById
);
UserRouter.put("/:id", authentication, allRoleAuthorization, updateUser);
UserRouter.put(
  "/updatePassword/:id",
  authentication,
  allRoleAuthorization,
  updateUserPassword
);
UserRouter.delete("/:id", authentication, allRoleAuthorization, deleteUser);

export default UserRouter;
