import express from "express";
import {
  createProject,
  deleteProject,
  gatAllProjects,
  getProjectById,
  getProjectsByType,
  getProjectTypes,
  updateProject,
} from "../controllers/projectController";

const projectRouter = express.Router();

projectRouter.get("/types", getProjectTypes);
projectRouter.post("/", createProject);
projectRouter.get("/", gatAllProjects);
projectRouter.post("/type", getProjectsByType);
projectRouter.get("/:id", getProjectById);
projectRouter.put("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);

export default projectRouter;
