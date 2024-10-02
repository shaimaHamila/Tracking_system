import Joi from "joi";

export const UserLoginValidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
export const UserSignupValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  roles: Joi.array().items(Joi.number()).optional(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});
