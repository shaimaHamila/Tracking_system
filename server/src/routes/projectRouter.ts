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
import { adminAuthorization } from "../middlewares/checkUserRole";

const projectRouter = express.Router();

projectRouter.get("/types", authentication, getProjectTypes);
projectRouter.post("/", authentication, adminAuthorization, createProject);
projectRouter.get("/all", authentication, adminAuthorization, getAllProjects);
projectRouter.post(
  "/type",
  authentication,
  adminAuthorization,
  getProjectsByType
);
projectRouter.get("/", authentication, adminAuthorization, getProjectById);
projectRouter.put("/", authentication, adminAuthorization, updateProject);
projectRouter.delete("/", authentication, deleteProject);

export default projectRouter;
