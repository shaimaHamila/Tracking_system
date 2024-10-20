import express from "express";

import { authentication } from "../middlewares/authMiddleware";
import { allRoleAuthorization } from "../middlewares/checkUserRole";

import {
  addComment,
  deleteComment,
  getCommentsByTicket,
  updateComment,
} from "../controllers/CommentController";

const CommentRouter = (io: any) => {
  const router = express.Router();

  router.post("/", authentication, allRoleAuthorization, addComment(io));
  router.put("/", authentication, allRoleAuthorization, updateComment(io));
  router.get(
    "/:ticketId",
    authentication,
    allRoleAuthorization,
    getCommentsByTicket
  );
  router.put(
    "/:commentId",
    authentication,
    allRoleAuthorization,
    deleteComment(io)
  );
  return router;
};

export default CommentRouter;
