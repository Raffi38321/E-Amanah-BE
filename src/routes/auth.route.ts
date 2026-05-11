import { Router } from "express";
import { validate } from "../middlewares/reqBody.middleware";
import { loginSchema } from "../validators/auth.validator";
import { loginController, meController } from "../controllers/auth.controller";
import verifyToken from "../middlewares/acl.middleware";

const authRouter = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *           example:
 *             email: "admin@kopi.com"
 *             password: "rahasiajangandibuka123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil bikin token"
 *               data:
 *                 token: "eyJhbGciOiJIUzI... (truncated JWT token)"
 *       400:
 *         description: Bad request (Invalid credentials or validation error)
 *         content:
 *           application/json:
 *             example:
 *               status: "failed"
 *               message: "password salah"
 *               data: null
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               status: "failed"
 *               message: "user gaketemu"
 *               data: null
 *
 * /auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user info
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil dapet data user"
 *               data:
 *                 employee:
 *                   _id: "65eabcd1234567890abcdef"
 *                   name: "Budi Admin"
 *                   email: "admin@kopi.com"
 *                   role: "admin"
 *                   createdAt: "2024-03-05T10:00:00.000Z"
 *                   updatedAt: "2024-03-05T10:00:00.000Z"
 *                   __v: 0
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: "failed"
 *               message: "token tidak ada / tidak valid"
 *               data: null
 */

authRouter.post("/login", validate(loginSchema), loginController);
authRouter.get("/me", [verifyToken], meController);

export default authRouter;
