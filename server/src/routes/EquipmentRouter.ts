import express from "express";
import {
  createEquipment,
  deleteEquipment,
  getAllEquipments,
  getEquipmentById,
  getEquipmentConditions,
  updateEquipment,
} from "../controllers/EquipmentController";
import { authentication } from "../middlewares/authMiddleware";
import { userAuthorization } from "../middlewares/checkUserRole";
import { Role } from "../types/Roles";

const EquipmentRouter = express.Router();

userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  EquipmentRouter.get("/conditions", authentication, getEquipmentConditions);
EquipmentRouter.post(
  "/",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  createEquipment
);
EquipmentRouter.get(
  "/all",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),

  getAllEquipments
);
EquipmentRouter.get(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),

  getEquipmentById
);
EquipmentRouter.put(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),

  updateEquipment
);
EquipmentRouter.delete(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  deleteEquipment
);

export default EquipmentRouter;
