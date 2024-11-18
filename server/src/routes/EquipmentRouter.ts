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

//Categories routes
EquipmentRouter.get(
  "/categories",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  getAllEquipmentCategories
);
EquipmentRouter.post(
  "/category",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  createEquipmentCategory
);

//Brands routes
EquipmentRouter.get(
  "/brands",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  getAllEquipmentBrands
);
EquipmentRouter.post(
  "/brand",
  authentication,
  userAuthorization([Role.ADMIN, Role.TECHNICAL_MANAGER, Role.STAFF]),
  createEquipmentBrand
);
export default EquipmentRouter;
