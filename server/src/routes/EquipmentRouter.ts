import express from "express";
import {
  createEquipment,
  getAllEquipments,
  getEquipmentById,
  getEquipmentConditions,
  updateEquipment,
} from "../controllers/EquipmentController";

const equipmentRouter = express.Router();

equipmentRouter.get("/conditions", getEquipmentConditions);
equipmentRouter.post("/", createEquipment);
equipmentRouter.get("/all", getAllEquipments);
equipmentRouter.get("/:id", getEquipmentById);
equipmentRouter.put("/:id", updateEquipment);

export default equipmentRouter;
