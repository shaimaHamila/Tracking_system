import express from "express";
import {
  createEquipment,
  createEquipmentBrand,
  createEquipmentCategory,
  deleteEquipment,
  getAllEquipmentBrands,
  getAllEquipmentCategories,
  getAllEquipments,
  getEquipmentById,
  getEquipmentConditions,
  updateAssignedUser,
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
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  getAllEquipments
);
EquipmentRouter.get(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  getEquipmentById
);
EquipmentRouter.put(
  "/update",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  updateEquipment
);
EquipmentRouter.put(
  "/assignedTo",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  updateAssignedUser
);
EquipmentRouter.delete(
  "/:id",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER]),
  deleteEquipment
);

//Categories routes
EquipmentRouter.get(
  "/category/all",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  getAllEquipmentCategories
);
EquipmentRouter.post(
  "/category/add",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  createEquipmentCategory
);

//Brands routes
EquipmentRouter.get(
  "/brand/all",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  getAllEquipmentBrands
);
EquipmentRouter.post(
  "/brand/add",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  createEquipmentBrand
);
export default EquipmentRouter;
