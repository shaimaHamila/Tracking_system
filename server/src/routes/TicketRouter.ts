import express from "express";

import { authentication } from "../middlewares/authMiddleware";
import {
  allRoleAuthorization,
  userAuthorization,
} from "../middlewares/checkUserRole";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  getTicketPriorities,
  getTicketStatuses,
  getTicketTypes,
  updateTicket,
} from "../controllers/TicketController";
import { Role } from "../types/Roles";

const ticketRouter = express.Router();

ticketRouter.get("/priorities", authentication, getTicketPriorities);
ticketRouter.get("/status", authentication, getTicketStatuses);
ticketRouter.get("/types", authentication, getTicketTypes);

ticketRouter.post(
  "/",
  authentication,
  userAuthorization([Role.ADMIN, Role.CLIENT, Role.STAFF]),
  createTicket
);
ticketRouter.put("/:id", authentication, allRoleAuthorization, updateTicket);
ticketRouter.get("/", authentication, allRoleAuthorization, getAllTickets);
ticketRouter.delete("/:id", authentication, allRoleAuthorization, deleteTicket);
ticketRouter.get("/:id", authentication, allRoleAuthorization, getTicketById);
export default ticketRouter;
