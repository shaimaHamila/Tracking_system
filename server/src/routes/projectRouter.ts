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

const projectRouter = express.Router();

projectRouter.get(
  "/types",
  authentication,
  adminAuthorization,
  getProjectTypes
);
projectRouter.post(
  "/",
  authentication,
  userAuthorization([Role.ADMIN]),
  createProject
);
projectRouter.get(
  "/all",
  authentication,
  userAuthorization([Role.ADMIN]),
  getAllProjects
);
projectRouter.post(
  "/type",
  authentication,
  adminAuthorization,
  getProjectsByType
);
projectRouter.get(
  "/",
  authentication,
  userAuthorization([Role.ADMIN]),
  getProjectById
);
projectRouter.put(
  "/",
  authentication,
  userAuthorization([Role.ADMIN, Role.STAFF, Role.TECHNICAL_MANAGER]),
  updateProject
);

projectRouter.delete("/", authentication, adminAuthorization, deleteProject);

export default projectRouter;
