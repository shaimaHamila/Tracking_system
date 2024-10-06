import express from "express";
import {
  createEquipment,
  getEquipmentConditions,
} from "../controllers/EquipmentController";

const equipmentRouter = express.Router();

equipmentRouter.get("/conditions", getEquipmentConditions);
equipmentRouter.post("/", createEquipment);

export default equipmentRouter;
