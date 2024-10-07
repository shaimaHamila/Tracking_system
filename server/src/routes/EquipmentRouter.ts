import express from "express";
import {
  createEquipment,
  getAllEquipments,
  getEquipmentConditions,
} from "../controllers/EquipmentController";
import e from "cors";

const equipmentRouter = express.Router();

equipmentRouter.get("/conditions", getEquipmentConditions);
equipmentRouter.post("/", createEquipment);
equipmentRouter.get("/all", getAllEquipments);

export default equipmentRouter;
