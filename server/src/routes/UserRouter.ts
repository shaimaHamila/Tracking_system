import express from "express";
import { createUser, getAllUsers } from "../controllers/UserController";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);

export default userRouter;
