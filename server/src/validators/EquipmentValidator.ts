import Joi from "joi";

const equipmentCondition = Joi.string()
  .valid("OPERATIONAL", "DAMAGED", "UNDER_MAINTENANCE", "REPAIRED")
  .optional();

// Create the Joi schema for validating the createEquipment request body.
export const createEquipmentValidator = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().optional(),
  serialNumber: Joi.string().max(100).required(),
  purchaseDate: Joi.date().iso().required(),
  warrantyEndDate: Joi.date().iso().greater(Joi.ref("purchaseDate")).required(),
  purchaseCost: Joi.number().min(0).optional(),
  purchaseCompany: Joi.string().max(100).optional(),
  brandName: Joi.string().max(80).required(),
  categoryName: Joi.string().max(80).required(),
  condition: equipmentCondition,
  assignedToId: Joi.number().optional(),
});

// Update the Joi schema for validating the createEquipment request body.
export const updateEquipmentValidator = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  serialNumber: Joi.string().max(100).optional(),
  purchaseDate: Joi.date().iso().optional(),
  warrantyEndDate: Joi.date().iso().greater(Joi.ref("purchaseDate")).optional(),
  purchaseCost: Joi.number().min(0).optional(),
  purchaseCompany: Joi.string().max(100).optional(),
  brand: Joi.string().max(50).optional(),
  categoryId: Joi.number().optional(),
  brandId: Joi.number().optional(),
  condition: equipmentCondition,
  assignedToId: Joi.number().optional(),
});
