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
    //todo add createdby
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

  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Project ID is required" });
  }

  const parsedProjectId = parseInt(id.toString(), 10);
  if (isNaN(parsedProjectId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid project ID" });
  }

  const existingProject = await prisma.project.findUnique({
    where: { id: parsedProjectId },
    include: {
      managers: true, // Assuming an explicit relation table `managers`
      teamMembers: true, // Assuming an explicit relation table `teamMembers`
    },
  });

  if (!existingProject) {
    return res
      .status(404)
      .json({ success: false, message: "Project not found" });
  }

  try {
    const { name, description, clientId, managers, teamMembers } = req.body;

    // Prepare the data object for updating the project
    const updateData: any = {};

    // Include only provided fields in the update data
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (clientId) updateData.clientId = parseInt(clientId, 10);

    // Step 1: Handle managers updates if provided
    if (managers && managers.length > 0) {
      try {
        await Promise.all(
          managers.map((managerId: number) =>
            validateUserRole(managerId, "STAFF")
          )
        );
      } catch (validationError: any) {
        // Catch the validation error and return the response
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }

      const existingManagerIds = existingProject.managers.map(
        (manager: any) => manager.managerId
      );

      // Determine managers to delete
      const managersToDelete = existingManagerIds.filter(
        (id) => !managers.includes(id)
      );

      // Determine managers to add
      const managersToAdd = managers.filter(
        (id: number) => !existingManagerIds.includes(id)
      );

      // Delete managers not in the updated list
      await prisma.project_manager.deleteMany({
        where: {
          projectId: parsedProjectId,
          managerId: { in: managersToDelete },
        },
      });

      // Add new managers
      await prisma.project_manager.createMany({
        data: managersToAdd.map((managerId: number) => ({
          projectId: parsedProjectId,
          managerId,
        })),
      });
    }

    // Step 2: Handle team members updates if provided
    if (teamMembers && teamMembers.length > 0) {
      try {
        await Promise.all(
          teamMembers.map((teamMemberId: number) =>
            validateUserRole(teamMemberId, "STAFF")
          )
        );
      } catch (validationError: any) {
        // Catch the validation error and return the response
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }

      const existingTeamMemberIds = existingProject.teamMembers.map(
        (teamMember: any) => teamMember.teamMemberId
      );

      // Determine team members to delete
      const teamMembersToDelete = existingTeamMemberIds.filter(
        (id) => !teamMembers.includes(id)
      );

      // Determine team members to add
      const teamMembersToAdd = teamMembers.filter(
        (id: number) => !existingTeamMemberIds.includes(id)
      );

      // Delete team members not in the updated list
      await prisma.project_team.deleteMany({
        where: {
          projectId: parsedProjectId,
          teamMemberId: { in: teamMembersToDelete },
        },
      });

      // Add new team members
      await prisma.project_team.createMany({
        data: teamMembersToAdd.map((teamMemberId: number) => ({
          projectId: parsedProjectId,
          teamMemberId,
        })),
      });
    }

    // Step 3: Update the project with the dynamic updateData object
    const updatedProject = await prisma.project.update({
      where: { id: parsedProjectId },
      data: updateData,
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
