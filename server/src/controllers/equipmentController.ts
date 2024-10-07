import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/responses";
import {
  createEquipmentValidator,
  updateEquipmentValidator,
} from "../validators/EquipmentValidator";
import { validateUserRole } from "./RoleController";

export enum EquipmentCondition {
  OPERATIONAL = "OPERATIONAL",
  DAMAGED = "DAMAGED",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  REPAIRED = "REPAIRED",
}

// Get all equipment conditions
export const getEquipmentConditions = async (req: Request, res: Response) => {
  try {
    const conditions = Object.values(EquipmentCondition);
    return Responses.OperationSuccess(res, conditions);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Create new equipment
export const createEquipment = async (req: Request, res: Response) => {
  const { error } = createEquipmentValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }

  try {
    const { categoryId, assignedToId, ...equipmentData } = req.body;

    if (assignedToId) {
      try {
        await validateUserRole(assignedToId, "STAFF");
      } catch (validationError: any) {
        return Responses.BadRequest(res, validationError.message);
      }
    }

    // Verify if the provided categoryId exists in the database
    if (categoryId) {
      const categoryExists = await prisma.equipmentCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return Responses.BadRequest(
          res,
          "Invalid category ID: Category does not exist."
        );
      }
    }
    const equipment = await prisma.equipment.create({
      data: {
        ...equipmentData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        assignedTo: assignedToId
          ? { connect: { id: assignedToId } }
          : undefined,
      },
      include: {
        category: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return Responses.CreateSucess(res, equipment);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get all equipment with filtering and pagination
export const getAllEquipments = async (req: Request, res: Response) => {
  const { page, pageSize, serialNumber, condition } = req.query;

  const skip =
    page && pageSize ? (Number(page) - 1) * Number(pageSize) : undefined;
  const take = page && pageSize ? Number(pageSize) : undefined;

  try {
    // Construct the filter options for the `findMany` query
    const filters = {
      ...(serialNumber
        ? { serialNumber: { equals: String(serialNumber) } }
        : {}),
      ...(condition ? { condition: condition as EquipmentCondition } : {}),
    };

    // Fetch equipment data with pagination and filtering
    const equipments = await prisma.equipment.findMany({
      where: filters,
      skip,
      take,
      include: {
        category: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Get the total count of equipments with the same filters (for consistent pagination)
    const totalCount = await prisma.equipment.count({
      where: filters,
    });

    const responsePayload = {
      data: equipments,
      meta:
        page && pageSize
          ? {
              totalCount,
              totalPages: Math.ceil(totalCount / (take ?? 1)), // Calculate pages only when pagination is applied
              currentPage: Number(page),
              pageSize: Number(pageSize),
            }
          : {
              totalCount,
            },
    };
    return Responses.FetchPagedSucess(res, responsePayload);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get equipment by ID
export const getEquipmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    if (!equipment) {
      return Responses.NotFound(res, "Equipment not found.");
    }
    return Responses.FetchSucess(res, equipment);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Update equipment
export const updateEquipment = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = updateEquipmentValidator.validate(req.body);

  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }
  try {
    const { categoryId, assignedToId, ...updatedEquipmentData } = req.body;

    if (assignedToId) {
      try {
        await validateUserRole(assignedToId, [
          "STAFF",
          "ADMIN",
          "SUPERADMIN",
          "TECHNICAL_MANAGER",
        ]);
      } catch (validationError: any) {
        return Responses.BadRequest(res, validationError.message);
      }
    }

    // Verify if the provided categoryId exists in the database
    if (categoryId) {
      const categoryExists = await prisma.equipmentCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return Responses.BadRequest(
          res,
          "Invalid category ID: Category does not exist."
        );
      }
    }

    const equipment = await prisma.equipment.update({
      where: { id: Number(id) },
      data: {
        ...updatedEquipmentData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        assignedTo: assignedToId
          ? { connect: { id: assignedToId } }
          : undefined,
      },
      include: {
        category: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return Responses.UpdateSucess(res, equipment);
  } catch (error) {
    console.error("Error updating equipment:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Delete equipment
export const deleteEquipment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if equipment exists
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(id) },
    });
    if (!equipment) {
      return Responses.NotFound(res, "Equipment not found.");
    }

    await prisma.equipment.delete({
      where: { id: Number(id) },
    });

    return Responses.DeleteSuccess(res);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};
