import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/UserController";
import { authentication } from "../middlewares/authMiddleware";
import { adminAuthorization } from "../middlewares/checkUserRole";

const userRouter = express.Router();

userRouter.post("/", authentication, adminAuthorization, createUser);
userRouter.get("/", authentication, getAllUsers);
userRouter.get("/:id", authentication, getUserById);
userRouter.put("/:id", authentication, updateUser);
userRouter.delete("/:id", authentication, deleteUser);

export default userRouter;
