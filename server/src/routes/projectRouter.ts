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
  allRoleAuthorization,
  userAuthorization,
} from "../middlewares/checkUserRole";
import { Role } from "../types/Roles";

const ProjectRouter = express.Router();

ProjectRouter.get(
  "/types",
  authentication,
  allRoleAuthorization,
  getProjectTypes
);
ProjectRouter.post(
  "/",
  authentication,
  userAuthorization([Role.ADMIN]),
  createProject
);
ProjectRouter.get("/all", authentication, allRoleAuthorization, getAllProjects);
ProjectRouter.post(
  "/type",
  authentication,
  adminAuthorization,
  getProjectsByType
);
ProjectRouter.get("/", authentication, allRoleAuthorization, getProjectById);
ProjectRouter.put(
  "/",
  authentication,
  userAuthorization([Role.ADMIN, Role.STAFF, Role.TECHNICAL_MANAGER]),
  updateProject
);

ProjectRouter.delete("/", authentication, adminAuthorization, deleteProject);

export default ProjectRouter;
