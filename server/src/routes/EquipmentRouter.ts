import express from "express";
import {
  createEquipment,
  deleteEquipment,
  getAllEquipments,
  getEquipmentById,
  getEquipmentConditions,
  updateEquipment,
} from "../controllers/EquipmentController";
import { adminOrTechnicalManagerAuthorization } from "../middlewares/checkUserRole";
import { authentication } from "../middlewares/authMiddleware";

const equipmentRouter = express.Router();

equipmentRouter.get("/conditions", authentication, getEquipmentConditions);
equipmentRouter.post(
  "/",
  authentication,
  adminOrTechnicalManagerAuthorization,
  createEquipment
);
equipmentRouter.get(
  "/all",
  authentication,
  adminOrTechnicalManagerAuthorization,
  getAllEquipments
);
equipmentRouter.get(
  "/:id",
  authentication,
  adminOrTechnicalManagerAuthorization,
  getEquipmentById
);
equipmentRouter.put(
  "/:id",
  authentication,
  adminOrTechnicalManagerAuthorization,
  updateEquipment
);
equipmentRouter.delete(
  "/:id",
  authentication,
  adminOrTechnicalManagerAuthorization,
  deleteEquipment
);

export default equipmentRouter;
