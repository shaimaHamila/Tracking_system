import Joi from "joi";

// Create Comment.
export const createCommentValidator = Joi.object({
  text: Joi.string().required(),
  attachedFiles: Joi.array().optional(),
});
export const updateCommentValidator = Joi.object({
  text: Joi.string().required(),
  attachedFiles: Joi.array().optional(),
}).min(1);
