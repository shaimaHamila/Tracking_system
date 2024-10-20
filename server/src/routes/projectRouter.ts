import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByType,
  getProjectTypes,
  updateProject,
} from "../controllers/ProjectController";
import { authentication } from "../middlewares/authMiddleware";
import {
  adminAuthorization,
  userAuthorization,
} from "../middlewares/checkUserRole";
import { Role } from "../types/Roles";

const ProjectRouter = express.Router();

ProjectRouter.get(
  "/types",
  authentication,
  adminAuthorization,
  getProjectTypes
);
ProjectRouter.post(
  "/",
  authentication,
  userAuthorization([Role.ADMIN]),
  createProject
);
ProjectRouter.get(
  "/all",
  authentication,
  userAuthorization([Role.ADMIN]),
  getAllProjects
);
ProjectRouter.post(
  "/type",
  authentication,
  adminAuthorization,
  getProjectsByType
);
ProjectRouter.get(
  "/",
  authentication,
  userAuthorization([Role.ADMIN]),
  getProjectById
);
ProjectRouter.put(
  "/",
  authentication,
  userAuthorization([Role.ADMIN, Role.STAFF, Role.TECHNICAL_MANAGER]),
  updateProject
);

ProjectRouter.delete("/", authentication, adminAuthorization, deleteProject);

export default ProjectRouter;
