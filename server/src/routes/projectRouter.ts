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

const projectRouter = express.Router();

projectRouter.get("/types", getProjectTypes);
projectRouter.post("/", createProject);
projectRouter.get("/all", getAllProjects);
projectRouter.post("/type", getProjectsByType);
projectRouter.get("/", getProjectById);
projectRouter.put("/", updateProject);
projectRouter.delete("/", deleteProject);

export default projectRouter;
