import Joi from "joi";

export const createUserValidator = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional(),
  password: Joi.string().min(6).required(),
  roleId: Joi.number().integer().positive().required(),
});

export const updateUserValidator = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional(),
  roleId: Joi.number().integer().positive().optional(),
  equipmentIds: Joi.array().items(Joi.number().integer().positive()).optional(),
});
