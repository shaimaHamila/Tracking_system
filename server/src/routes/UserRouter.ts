import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/UserController";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);

export default userRouter;
