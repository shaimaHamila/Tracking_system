import express from "express";

import { authentication } from "../middlewares/authMiddleware";
import { allRoleAuthorization } from "../middlewares/checkUserRole";

import { addComment } from "../controllers/CommentController";

const commentRouter = express.Router();

commentRouter.post("/", authentication, allRoleAuthorization, addComment);

export default commentRouter;
