import express from "express";

import { authentication } from "../middlewares/authMiddleware";
import {
  adminAuthorization,
  userAuthorization,
} from "../middlewares/checkUserRole";
import {
  createTicket,
  getTicketPriorities,
  getTicketStatus,
  getTicketTypes,
} from "../controllers/TicketController";
import { Role } from "../types/Roles";

const ticketRouter = express.Router();

ticketRouter.get("/priorities", authentication, getTicketPriorities);
ticketRouter.get("/status", authentication, getTicketStatus);
ticketRouter.get("/types", authentication, getTicketTypes);

ticketRouter.post(
  "/",
  authentication,
  userAuthorization([Role.ADMIN, Role.CLIENT, Role.STAFF]),
  adminAuthorization,
  createTicket
);

export default ticketRouter;
