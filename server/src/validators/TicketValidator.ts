import Joi from "joi";
const ticketType = Joi.string()
  .valid("BUG", "FEATURE", "CONSULTATION", "REQUEST")
  .optional();
const ticketStatus = Joi.number().valid(1, 2, 3, 4).optional(); // Matches TicketStatus enum
const ticketPriority = Joi.string()
  .valid("LOW", "MEDIUM", "HIGH", "CRITICAL")
  .optional(); // Matches TicketPriority enum

export const createTicketValidator = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().optional().max(500),
  type: ticketType,
  priority: Joi.string().optional(),
  projectId: Joi.number().integer().required(),
  equipmentId: Joi.number().integer().optional(),
});

export const updateTicketValidator = Joi.object({
  // The creator can update title, description, and type
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  type: ticketType,

  // The technical manager and admin can update the status
  statusId: ticketStatus,

  // The project manager and admin can update the priority
  priority: ticketPriority,

  // The project manager can update the assigned users (array of user IDs)
  assignedUsers: Joi.array().items(Joi.number()).optional(),

  // Optional project ID (for reference, although not typically updated)
  projectId: Joi.number().optional(),
}).min(1); // Ensures at least one field is being updated
