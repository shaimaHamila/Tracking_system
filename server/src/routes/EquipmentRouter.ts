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

const equipmentRouter = express.Router();

userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  equipmentRouter.get("/conditions", authentication, getEquipmentConditions);
equipmentRouter.post(
  "/",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  createEquipment
);
equipmentRouter.get(
  "/all",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),

  getAllEquipments
);
equipmentRouter.get(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),

  getEquipmentById
);
equipmentRouter.put(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),

  updateEquipment
);
equipmentRouter.delete(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  deleteEquipment
);

export default equipmentRouter;
