import Joi from "joi";

export const createUserValidator = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional(),
  password: Joi.string().min(6).required(),
  roleId: Joi.number().integer().positive().required(),
});
