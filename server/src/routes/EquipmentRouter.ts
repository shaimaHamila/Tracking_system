import express from "express";
import {
  createEquipment,
  deleteEquipment,
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
equipmentRouter.delete("/:id", deleteEquipment);

export default equipmentRouter;
