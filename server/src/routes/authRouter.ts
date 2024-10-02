import express from "express";
import { login, signup } from "../controllers/authController";

const authRouter = express.Router();
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: User signup.
 *     description: Create a new user account.
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
authRouter.post("/signup", signup);
authRouter.post("/login", login);

export default authRouter;
