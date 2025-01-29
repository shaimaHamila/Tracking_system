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

const TicketRouter = (io: any) => {
  const router = express.Router();

  router.get("/priorities", authentication, getTicketPriorities);
  router.get("/status", authentication, getTicketStatuses);
  router.get("/types", authentication, getTicketTypes);

  router.post(
    "/",
    authentication,
    userAuthorization([
      Role.ADMIN,
      Role.CLIENT,
      Role.STAFF,
      Role.TECHNICAL_MANAGER,
    ]), // Only these roles can create tickets
    createTicket(io)
  );
  router.put("/:id", authentication, allRoleAuthorization, updateTicket(io));
  router.get("/", authentication, allRoleAuthorization, getAllTickets);
  router.delete("/:id", authentication, allRoleAuthorization, deleteTicket(io));
  router.get("/:id", authentication, allRoleAuthorization, getTicketById);

  return router;
};

export default TicketRouter;
