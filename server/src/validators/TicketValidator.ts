import Joi from "joi";

export const createTicketValidator = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().optional().max(500),
  type: Joi.string()
    .valid("BUG", "FEATURE", "CONSULTATION", "REQUEST")
    .optional(),
  priority: Joi.string().optional(),
  assignedToId: Joi.number().integer().optional(),
  projectId: Joi.number().integer().required(),
});
