import Joi from "joi";
import { ProjectType } from "../types/Project";

const projectTypeEnum = Joi.string()
  .valid(ProjectType.INTERNAL, ProjectType.EXTERNAL)
  .required();

// Optimized validation schema
export const CreateProjectValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  projectType: projectTypeEnum,
  clientId: Joi.any().required(),

  // If projectType is INTERNAL, managers are required
  managers: Joi.array()
    .items(Joi.number())
    .when("projectType", {
      is: ProjectType.INTERNAL,
      then: Joi.array().min(1).required().messages({
        "array.min": "At least one manager is required",
        "any.required": "Project Manager is required for internal projects",
      }),
    })
    .optional(),

  // If projectType is EXTERNAL, technicalManagerId is required
  technicalManagerId: Joi.number().when("projectType", {
    is: ProjectType.EXTERNAL,
    then: Joi.required().messages({
      "any.required": "Technical Manager is required for external projects",
    }),
  }),

  teamMembers: Joi.array().items(Joi.number()).optional(),
});

export const GetProjectByTypeValidator = Joi.object({
  projectType: projectTypeEnum,
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
