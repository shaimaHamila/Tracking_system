import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/Responses";
import {
  createEquipmentValidator,
  updateEquipmentValidator,
} from "../validators/EquipmentValidator";
import { validateUserRole } from "./RoleController";
import { log } from "console";

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
    const { categoryName, brandName, assignedToId, ...equipmentData } =
      req.body;

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

    // Check and create the category if it does not exist
    let category = null;
    if (categoryName) {
      category = await checkCategoryExists(categoryName);
      if (!category) {
        category = await prisma.equipmentCategory.create({
          data: { categoryName },
        });
      }
    }

    // Check and create the brand if it does not exist
    let brand = null;
    if (brandName) {
      brand = await checkBrandExists(brandName);
      if (!brand) {
        brand = await prisma.equipmentBrand.create({
          data: { brandName },
        });
      }
    }

    const equipment = await prisma.equipment.create({
      data: {
        ...equipmentData,
        brand: brand ? { connect: { id: brand.id } } : undefined,
        category: category ? { connect: { id: category.id } } : undefined,
        assignedTo: assignedToId
          ? { connect: { id: assignedToId } }
          : undefined,
      },
      include: {
        brand: true,
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
    return Responses.CreateSuccess(res, equipment);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get all equipment with filtering and pagination
export const getAllEquipments = async (req: Request, res: Response) => {
  const { page, pageSize, serialNumber, conditions } = req.query;

  const skip =
    page && pageSize ? (Number(page) - 1) * Number(pageSize) : undefined;
  const take = page && pageSize ? Number(pageSize) : undefined;

  try {
    // Construct the filter options for the `findMany` query
    const filters = {
      ...(serialNumber
        ? { serialNumber: { equals: String(serialNumber) } }
        : {}),
      ...(conditions && Array.isArray(conditions) && conditions.length > 0
        ? { condition: { in: conditions as EquipmentCondition[] } }
        : {}),
    };

    // Fetch equipment data with pagination and filtering
    const equipments = await prisma.equipment.findMany({
      where: filters,
      skip,
      take,
      include: {
        category: true,
        brand: true,
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
    return Responses.UpdateSuccess(res, equipment);
  } catch (error) {
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

// Fetch all equipment brands
export const getAllEquipmentBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.equipmentBrand.findMany();
    return Responses.FetchSucess(res, brands);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

export const checkBrandExists = async (brandName: string) => {
  const existingBrand = await prisma.equipmentBrand.findFirst({
    where: {
      brandName: {
        equals: brandName,
        mode: "insensitive",
      },
    },
  });
  return existingBrand;
};

// Add new equipment brand
export const createEquipmentBrand = async (req: Request, res: Response) => {
  const { brandName } = req.body;

  if (!brandName) {
    return Responses.BadRequest(res, "Brand name is required.");
  }

  try {
    // Use the helper to check if the brand already exists
    const existingBrand = await checkBrandExists(brandName);

    if (existingBrand) {
      return Responses.BadRequest(res, "Brand name already exists.");
    }

    // Create a new brand if it does not exist
    const brand = await prisma.equipmentBrand.create({
      data: {
        brandName,
      },
    });

    return Responses.CreateSuccess(res, brand);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Fetch all equipment categories
export const getAllEquipmentCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.equipmentCategory.findMany();
    return Responses.FetchSucess(res, categories);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Add new equipment category
export const createEquipmentCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return Responses.BadRequest(res, "Category name is required.");
  }

  try {
    const existingCategory = await checkCategoryExists(categoryName);

    if (existingCategory) {
      return Responses.BadRequest(res, "Category name already exists.");
    }

    const category = await prisma.equipmentCategory.create({
      data: {
        categoryName,
      },
    });

    return Responses.CreateSuccess(res, category);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};
export const checkCategoryExists = async (categoryName: string) => {
  const existingCategory = await prisma.equipmentCategory.findFirst({
    where: {
      categoryName: {
        equals: categoryName,
        mode: "insensitive", // Case-insensitive mode
      },
    },
  });
  return existingCategory;
};
