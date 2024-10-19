import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/Responses";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import { createCommentValidator } from "../validators/CommentValidator";

export const addComment = async (req: Request, res: Response) => {
  const { error } = createCommentValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }
  const { id } = req.query;
  if (!id) {
    return Responses.BadRequest(res, "Ticket ID is required");
  }

  const { text, attachedFiles } = req.body;

  try {
    // Get the current user's ID from the decoded token
    const createdById = res.locals.decodedToken.id;

    // Verify the current user exists and handle errors
    let user;
    try {
      user = await getCurrentUser(parseInt(createdById, 10));
    } catch (error: any) {
      return Responses.BadRequest(res, error.message);
    }

    // Ensure the ticket exists before adding a comment
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      return Responses.NotFound(res, "Ticket not found");
    }

    // Create a new comment
    const newComment = await prisma.comment.create({
      data: {
        text,
        atachedFiles: attachedFiles || [],
        ticketId: Number(id),
        createdByUserId: user.id,
      },
      include: {
        createdby: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return Responses.OperationSuccess(res, newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
