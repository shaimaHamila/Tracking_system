import { Request, Response } from "express";
import {
  CreateProjectValidator,
  GetProjectByTypeValidator,
} from "../validators/ProjectValidator";
import prisma from "../prisma";

export enum ProjectType {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL",
}
// Controller to get the enum values
export const getProjectTypes = (_req: Request, res: Response) => {
  // Convert the enum to a list of values
  const projectTypes = Object.values(ProjectType);

  return res.status(200).json({
    success: true,
    message: "Project types fetched successfully",
    data: projectTypes,
  });
};

//Create a new project
export const createProject = async (req: Request, res: Response) => {
  const { error } = CreateProjectValidator.validate(req.body);
  if (error) {
    console.error("Error during project creation validation:", error);
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { name, description, projectType, clientId, managers, teamMembers } =
      req.body;

    // Create a new project with client and managers, and optionally team members
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        projectType,
        clientId,
        managers: {
          create: managers.map((managerId: number) => ({
            managerId,
          })),
        },
        teamMembers: teamMembers
          ? {
              create: teamMembers.map((staffId: number) => ({
                staffId,
              })),
            }
          : undefined,
      },
      include: {
        client: true,
        managers: true,
        teamMembers: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project successfully created",
      data: newProject,
    });
  } catch (error) {
    console.error("Error during project creation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
//Get all projects
export const gatAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: true,
        managers: true,
        teamMembers: true,
        client: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get Projects By Type
export const getProjectsByType = async (req: Request, res: Response) => {
  const { error } = GetProjectByTypeValidator.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  try {
    const { projectType } = req.body;
    const projects = await prisma.project.findMany({
      where: {
        projectType: projectType as ProjectType,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${projectType} projects fetched successfully`,
      data: projects,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get Project by ID
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid project ID" });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: {
        client: true, // Include related data (optional)
        teamMembers: true,
        managers: true,
      },
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
