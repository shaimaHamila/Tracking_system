import { Request, Response } from "express";
import {
  CreateProjectValidator,
  GetProjectByTypeValidator,
  UpdateProjectValidator,
} from "../validators/ProjectValidator";
import prisma from "../prisma";
import { validateUserRole } from "./roleController";

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
    // Parse IDs to ensure they are integers
    const parsedClientId = parseInt(clientId, 10);
    const parsedManagers = managers.map((managerId: any) =>
      parseInt(managerId, 10)
    );
    const parsedTeamMembers = teamMembers
      ? teamMembers.map((staffId: any) => parseInt(staffId, 10))
      : [];

    // Validate the client
    await validateUserRole(parsedClientId, "CLIENT");

    // Validate managers and team members
    for (const managerId of parsedManagers) {
      await validateUserRole(managerId, "STAFF");
    }

    if (teamMembers) {
      for (const staffId of parsedTeamMembers) {
        await validateUserRole(staffId, "STAFF");
      }
    }

    // Create the project in the database
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        projectType,
        clientId: parsedClientId,
        managers: {
          create: parsedManagers.map((managerId: number) => ({
            managerId,
          })),
        },
        teamMembers: parsedTeamMembers
          ? {
              create: parsedTeamMembers.map((staffId: number) => ({
                staffId,
              })),
            }
          : undefined,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        managers: {
          include: {
            manager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        teamMembers: {
          include: {
            teamMember: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project successfully created",
      data: newProject,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
// Get all projects
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: true,
        managers: {
          include: {
            manager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        teamMembers: {
          include: {
            teamMember: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
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
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: `${projectType} projects fetched successfully`,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects by type:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get Project by ID
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.query;
  const parsedprojectId = parseInt(id as string, 10);

  if (isNaN(Number(parsedprojectId))) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid project ID" });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id: parsedprojectId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        teamMembers: {
          include: {
            teamMember: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        managers: {
          include: {
            manager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update Project
export const updateProject = async (req: Request, res: Response) => {
  const { error } = UpdateProjectValidator.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { id } = req.params;
    const { name, description, clientId, managerIds, teamMemberIds } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id: Number(id) },
    });
    if (!existingProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        clientId,
        managers: managerIds ? { set: managerIds } : undefined,
        teamMembers: teamMemberIds ? { set: teamMemberIds } : undefined,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        teamMembers: {
          include: {
            teamMember: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        managers: {
          include: {
            manager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Delete Project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Project ID is required" });
  }
  const parsedprojectId = parseInt(id.toString(), 10);
  if (isNaN(Number(parsedprojectId))) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid project ID" });
  }
  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: parsedprojectId },
    });
    if (!existingProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    await prisma.project.delete({ where: { id: parsedprojectId } });

    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
