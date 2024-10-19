import express from "express";

import { authentication } from "../middlewares/authMiddleware";
import { allRoleAuthorization } from "../middlewares/checkUserRole";

import {
  addComment,
  getCommentsByTicket,
  updateComment,
} from "../controllers/CommentController";

const commentRouter = express.Router();

commentRouter.post("/", authentication, allRoleAuthorization, addComment);
commentRouter.put("/", authentication, allRoleAuthorization, updateComment);
commentRouter.get(
  "/:ticketId",
  authentication,
  allRoleAuthorization,
  getCommentsByTicket
);

export default commentRouter;
