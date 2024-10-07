import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/UserController";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

export default userRouter;
