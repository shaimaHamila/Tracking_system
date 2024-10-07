import express from "express";
import {
  createEquipment,
  getAllEquipments,
  getEquipmentById,
  getEquipmentConditions,
} from "../controllers/EquipmentController";

const equipmentRouter = express.Router();

equipmentRouter.get("/conditions", getEquipmentConditions);
equipmentRouter.post("/", createEquipment);
equipmentRouter.get("/all", getAllEquipments);
equipmentRouter.get("/:id", getEquipmentById);

export default equipmentRouter;
