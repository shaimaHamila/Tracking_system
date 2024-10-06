import Joi from "joi";

const equipmentCondition = Joi.string()
  .valid("OPERATIONAL", "DAMAGED", "UNDER_MAINTENANCE", "REPAIRED")
  .optional();

// Create the Joi schema for validating the createEquipment request body.
export const createEquipmentValidator = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  serialNumber: Joi.string().max(100).required(),
  purchaseDate: Joi.date().iso().required(),
  warrantyEndDate: Joi.date().iso().greater(Joi.ref("purchaseDate")).required(),
  purchaseCost: Joi.number().min(0).optional(),
  purchaseCompany: Joi.string().max(100).optional(),
  brand: Joi.string().max(50).optional(),
  categoryId: Joi.number().required(),
  condition: equipmentCondition,
  assignedToId: Joi.number().optional(),
});
