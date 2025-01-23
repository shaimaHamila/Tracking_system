import express from "express";
import { getStats } from "../controllers/StatsController";
import { authentication } from "../middlewares/authMiddleware";
import { allRoleAuthorization } from "../middlewares/checkUserRole";

const StatRouter = express.Router();

StatRouter.get("/dashboard", authentication, allRoleAuthorization, getStats);

export default StatRouter;
