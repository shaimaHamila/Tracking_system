import Joi from "joi";

export const CreateProjectValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  projectType: Joi.string().valid("INTERNAL", "EXTERNAL").required(),
  clientId: Joi.number().required(),
  managers: Joi.array().items(Joi.number()).min(1).required(),
  teamMembers: Joi.array().items(Joi.number()).optional(),
});
export const GetProjectByTypeValidator = Joi.object({
  projectType: Joi.string().valid("INTERNAL", "EXTERNAL").required(),
});
