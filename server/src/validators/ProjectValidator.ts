import Joi from "joi";

const projectTypeEnum = Joi.string().valid("INTERNAL", "EXTERNAL").required();

export const CreateProjectValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  projectType: projectTypeEnum,
  clientId: Joi.any().required(),
  managers: Joi.array().items(Joi.number()).min(1).required(),
  teamMembers: Joi.array().items(Joi.number()).optional(),
});
export const GetProjectByTypeValidator = Joi.object({
  projectType: Joi.string().valid("INTERNAL", "EXTERNAL").required(),
});

// Update Project Validator
export const UpdateProjectValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  clientId: Joi.number().optional(),
  managers: Joi.array().items(Joi.number().optional()).optional().messages({
    "array.base": "Managers should be an array of IDs",
  }),
  teamMembers: Joi.array().items(Joi.number().optional()).optional().messages({
    "array.base": "Team members should be an array of IDs",
  }),
});
