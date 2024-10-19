import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/Responses";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import {
  createCommentValidator,
  updateCommentValidator,
} from "../validators/CommentValidator";
import { Res } from "tsoa";

export const addComment = async (req: Request, res: Response) => {
  const { error } = createCommentValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }
  const { ticketId } = req.query;
  if (!ticketId) {
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
      where: { id: Number(ticketId) },
    });

    if (!ticket) {
      return Responses.NotFound(res, "Ticket not found");
    }

    // Create a new comment
    const newComment = await prisma.comment.create({
      data: {
        text,
        atachedFiles: attachedFiles || [],
        ticketId: Number(ticketId),
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
    return Responses.InternalServerError(
      res,
      "An error occurred while adding the comment"
    );
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { error } = updateCommentValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }
  const { commentId } = req.query;
  if (!commentId) {
    return Responses.BadRequest(res, "Comment ID is required");
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

    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return Responses.NotFound(res, "Comment not found");
    }

    // Ensure the user can only edit their own comments
    if (comment.createdByUserId !== user.id) {
      return Responses.Forbidden(res, "You can only edit your own comments");
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        text: text || comment.text,
        atachedFiles: attachedFiles || comment.atachedFiles,
      },
    });

    return Responses.OperationSuccess(res, updatedComment);
  } catch (error) {
    console.error(error);
    return Responses.InternalServerError(
      res,
      "An error occurred while editing the comment"
    );
  }
};
