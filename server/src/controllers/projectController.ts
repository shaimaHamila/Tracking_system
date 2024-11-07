import { Request, Response } from "express";
import {
  CreateProjectValidator,
  GetProjectByTypeValidator,
  UpdateProjectValidator,
} from "../validators/ProjectValidator";
import prisma from "../prisma";
import { validateUserRole } from "./RoleController";
import { Responses } from "../helpers/Responses";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import { ProjectType } from "../types/Project";
import { Role } from "../types/Roles";

// Controller to get the enum values
export const getProjectTypes = (_req: Request, res: Response) => {
  // Convert the enum to a list of values
  const projectTypes = Object.values(ProjectType);
  return Responses.FetchSucess(res, projectTypes);
};

//Create a new project
export const createProject = async (req: Request, res: Response) => {
  const { error } = CreateProjectValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }

  try {
    //todo add createdby
    const {
      name,
      description,
      projectType,
      clientId,
      managers,
      teamMembers,
      technicalManagerId,
    } = req.body;

    // Get the current user's ID from the decoded token
    const createdById = res.locals.decodedToken.id;

    // Verify the current user exists and handle errors
    let user;
    try {
      user = await getCurrentUser(parseInt(createdById, 10));
    } catch (error: any) {
      return Responses.BadRequest(res, error.message);
    }

    const parsedTeamMembers = teamMembers
      ? teamMembers.map((staffId: any) => parseInt(staffId, 10))
      : [];

    try {
      await Promise.all([
        // Validate the client
        clientId ? validateUserRole(clientId, Role.CLIENT) : null,

        // Validate the technical manager if provided
        technicalManagerId
          ? validateUserRole(technicalManagerId, Role.TECHNICAL_MANAGER)
          : null,

        // Validate managers
        ...(managers
          ? managers.map((managerId: number) =>
              validateUserRole(managerId, Role.STAFF)
            )
          : []),

        // Validate team members if they exist
        ...(parsedTeamMembers.length
          ? parsedTeamMembers.map((staffId: number) =>
              validateUserRole(staffId, Role.STAFF)
            )
          : []),
      ]);
    } catch (validationError: any) {
      return Responses.BadRequest(res, validationError.message);
    }

    // Create the project in the database
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        projectType,
        clientId: clientId,
        technicalManagerId: technicalManagerId ?? technicalManagerId,
        createdById: user.id,
        managers: managers
          ? {
              create: managers.map((managerId: number) => ({
                managerId,
              })),
            }
          : undefined,
        teamMembers: parsedTeamMembers
          ? {
              create: parsedTeamMembers.map((staffId: number) => ({
                staffId,
              })),
            }
          : undefined,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
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
        technicalManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return Responses.CreateSucess(res, newProject);
  } catch (error: any) {
    return Responses.InternalServerError(res, error.message);
  }
};
// Get all projects
export const getAllProjects = async (req: Request, res: Response) => {
  const { page, pageSize, projectType, projectName } = req.query;
  const _projectType = projectType ? (projectType as ProjectType) : undefined;
  const _projectName = projectName ? (projectName as string) : undefined;

  const skip =
    page && pageSize ? (Number(page) - 1) * Number(pageSize) : undefined;
  const take = page && pageSize ? Number(pageSize) : undefined;

  // Get the current user's ID from the decoded token
  const createdById = res.locals.decodedToken.id;

  // Verify the current user exists and handle errors
  let user;
  try {
    user = await getCurrentUser(parseInt(createdById, 10));
  } catch (error: any) {
    return Responses.BadRequest(res, error.message);
  }

  try {
    // Define query filters
    let filters: any = {};
    // Apply projectType filter if provided
    if (_projectType) {
      filters.projectType = _projectType;
    }

    // Apply projectName filter if provided
    if (projectName && projectName !== "null") {
      filters.name = {
        contains: String(projectName),
        mode: "insensitive",
      };
    }

    switch (user.role.roleName) {
      case Role.ADMIN:
        break;

      case Role.STAFF:
        filters = {
          ...filters,

          OR: [
            { managers: { some: { managerId: user.id } } },
            { teamMembers: { some: { teamMemberId: user.id } } },
          ],
        };
        break;

      case Role.CLIENT:
        filters = {
          ...filters,

          clientId: user.id,
        };
        break;

      case Role.TECHNICAL_MANAGER:
        filters = {
          ...filters,

          technicalManagerId: user.id,
        };
        break;

      default:
        return Responses.Forbidden(
          res,
          "You do not have permission to view projects."
        );
    }

    // Fetch projects with the applied filters
    const projects = await prisma.project.findMany({
      where: filters,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        technicalManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    // Flatten teamMembers data
    const transformedProjects = projects.map((project) => ({
      ...project,
      teamMembers: project.teamMembers.map(({ teamMember }) => teamMember),
      managers: project.managers.map(({ manager }) => manager),
    }));
    // Get the total count of projects for pagination
    const totalProjects = await prisma.project.count({
      where: filters,
    });
    const responsePayload = {
      data: transformedProjects,
      meta:
        page && pageSize
          ? {
              totalCount: totalProjects,
              totalPages: Math.ceil(totalProjects / (take ?? 1)),
              currentPage: Number(page),
              pageSize: Number(pageSize),
            }
          : {
              totalCount: totalProjects,
            },
    };

    return Responses.FetchPagedSucess(res, responsePayload);
  } catch (error) {
    return Responses.InternalServerError(res, "Error fetching projects.");
  }
};

// Get Projects By Type
export const getProjectsByType = async (req: Request, res: Response) => {
  const { error } = GetProjectByTypeValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
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
    return Responses.FetchSucess(res, projects);
  } catch (error) {
    return Responses.InternalServerError(
      res,
      "Error fetching projects by type."
    );
  }
};

// Get Project by ID
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.query;
  const parsedprojectId = parseInt(id as string, 10);

  if (isNaN(Number(parsedprojectId))) {
    return Responses.BadRequest(res, "Invalid project ID");
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
        technicalManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return Responses.NotFound(res, "Project not found");
    }

    return Responses.FetchSucess(res, project);
  } catch (error) {
    return Responses.InternalServerError(res, "Error fetching project by ID.");
  }
};

// Update Project
export const updateProject = async (req: Request, res: Response) => {
  const { error } = UpdateProjectValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }

  const { id } = req.query;
  if (!id) {
    return Responses.BadRequest(res, "Project ID is required");
  }

  const parsedProjectId = parseInt(id.toString(), 10);
  if (isNaN(parsedProjectId)) {
    return Responses.BadRequest(res, "Invalid project ID");
  }

  const existingProject = await prisma.project.findUnique({
    where: { id: parsedProjectId },
    include: {
      managers: true,
      teamMembers: true,
    },
  });

  if (!existingProject) {
    return Responses.NotFound(res, "Project not found");
  }
  if (
    existingProject.projectType === ProjectType.INTERNAL &&
    req.body.managers.length == 0
  ) {
    return Responses.BadRequest(res, "At least one manager is required");
  }
  try {
    const {
      name,
      description,
      clientId,
      managers,
      teamMembers,
      technicalManagerId,
      projectType,
    } = req.body;

    // Prepare the data object for updating the project
    const updateData: any = {};

    // Include only provided fields in the update data
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (projectType) updateData.projectType = projectType;
    if (clientId) updateData.clientId = parseInt(clientId, 10);
    if (technicalManagerId)
      updateData.technicalManagerId = parseInt(technicalManagerId, 10);

    try {
      await Promise.all([
        // Validate the client
        clientId ? validateUserRole(clientId, Role.CLIENT) : null,

        // Validate the technical manager if provided
        technicalManagerId
          ? validateUserRole(technicalManagerId, Role.TECHNICAL_MANAGER)
          : null,
      ]);
    } catch (validationError: any) {
      return Responses.BadRequest(res, validationError.message);
    }

    // Step 1: Handle managers updates if provided
    if (managers && managers?.length > 0) {
      try {
        await Promise.all(
          // Validate managers to update if provided
          managers.map((managerId: number) =>
            validateUserRole(managerId, Role.STAFF)
          )
        );
      } catch (validationError: any) {
        return Responses.BadRequest(res, validationError.message);
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
        return Responses.BadRequest(res, validationError.message);
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

    return Responses.UpdateSuccess(res, updatedProject);
  } catch (error) {
    return Responses.InternalServerError(res, "Error updating project.");
  }
};

// Delete Project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return Responses.BadRequest(res, "Project ID is required");
  }
  const parsedprojectId = parseInt(id.toString(), 10);
  if (isNaN(Number(parsedprojectId))) {
    return Responses.BadRequest(res, "Invalid project ID");
  }
  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: parsedprojectId },
    });
    if (!existingProject) {
      return Responses.NotFound(res, "Project not found");
    }

    await prisma.project.delete({ where: { id: parsedprojectId } });

    return Responses.DeleteSuccess(res);
  } catch (error) {
    return Responses.InternalServerError(res, "Error deleting project.");
  }
};
