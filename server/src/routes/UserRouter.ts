import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/UserController";
import { authentication } from "../middlewares/authMiddleware";
import {
  adminAuthorization,
  allRoleAuthorization,
  userAuthorization,
} from "../middlewares/checkUserRole";
import { Role } from "../types/Roles";

const userRouter = express.Router();

userRouter.post("/", authentication, adminAuthorization, createUser);
userRouter.get("/", authentication, allRoleAuthorization, getAllUsers);
userRouter.get(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.STAFF, Role.TECHNICAL_MANAGER]),
  getUserById
);
userRouter.put("/:id", authentication, allRoleAuthorization, updateUser);
userRouter.delete("/:id", authentication, allRoleAuthorization, deleteUser);

export default userRouter;
