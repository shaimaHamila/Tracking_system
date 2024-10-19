import express from "express";

import { authentication } from "../middlewares/authMiddleware";
import { allRoleAuthorization } from "../middlewares/checkUserRole";

import { addComment, updateComment } from "../controllers/CommentController";

const commentRouter = express.Router();

commentRouter.post("/", authentication, allRoleAuthorization, addComment);
commentRouter.put("/", authentication, allRoleAuthorization, updateComment);

export default commentRouter;
