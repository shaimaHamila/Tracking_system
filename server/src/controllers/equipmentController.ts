import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/responses";
import { createEquipmentValidator } from "../validators/EquipmentValidator";

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
    console.error("Error fetching equipment conditions:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Create new equipment
export const createEquipment = async (req: Request, res: Response) => {
  const { error } = createEquipmentValidator.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }

  try {
    const equipment = await prisma.equipment.create({
      data: {
        ...req.body,
        category: { connect: { id: req.body.categoryId } }, // Ensure categoryId exists and connect it
        assignedTo: req.body.assignedToId
          ? { connect: { id: req.body.assignedToId } }
          : undefined, // Ensure assignedToId exists and connect it
      },
    });
    return Responses.CreateSucess(res, equipment);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get all equipment with filtering and pagination
export const getAllEquipments = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10, condition } = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  try {
    const equipments = await prisma.equipment.findMany({
      skip,
      take,
      // where: condition ? { condition } : {},
    });
    const totalCount = await prisma.equipment.count({
      // where: condition ? { condition } : {},
    });

    return Responses.FetchPagedSucess(res, {
      data: equipments,
      meta: {
        totalCount,
        totalPages: Math.ceil(totalCount / take),
        currentPage: Number(page),
        pageSize: Number(pageSize),
      },
    }); // Adjusted response method
  } catch (error) {
    console.error("Error fetching all equipments:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get equipment by ID
export const getEquipmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(id) },
    });
    if (!equipment) {
      return Responses.NotFound(res, "Equipment not found."); // Adjusted response method
    }
    return Responses.OperationSuccess(res, equipment); // Adjusted response method
  } catch (error) {
    console.error("Error fetching equipment by ID:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Update equipment
export const updateEquipment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    serialNumber,
    purchaseDate,
    warrantyEndDate,
    purchaseCost,
    purchaseCompany,
    brand,
    categoryId,
    condition,
    statusId,
    assignedToId,
  } = req.body;

  try {
    const equipment = await prisma.equipment.update({
      where: { id: Number(id) },
      data: {
        name,
        serialNumber,
        purchaseDate,
        warrantyEndDate,
        purchaseCost,
        purchaseCompany,
        brand,
        categoryId,
        condition,
        statusId,
        assignedToId,
      },
    });
    return Responses.UpdateSucess(res, equipment); // Adjusted response method
  } catch (error) {
    console.error("Error updating equipment:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Delete equipment
export const deleteEquipment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.equipment.delete({
      where: { id: Number(id) },
    });
    return Responses.DeleteSuccess(res); // Adjusted response method
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};
