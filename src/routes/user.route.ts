import { Router } from "express";
import { validate } from "../middlewares/reqBody.middleware";
import { userSchema } from "../validators/user.validator";
import upload from "../middlewares/multer.middleware";
import verifyToken from "../middlewares/acl.middleware";
import isUserAuthorized from "../middlewares/rbac.middleware";
import Roles from "../utils/Role";
import {
  createUser,
  deleteUser,
  getUser,
} from "../controllers/user.controller";

const userRouter = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [Admin, Mahasiswa]
 *               NIM:
 *                 type: number
 *               photo:
 *                 type: string
 *                 format: binary
 *           example:
 *             name: "Joko Barista"
 *             email: "joko@kopi.com"
 *             password: "passwordsuperkuat"
 *             role: "Mahasiswa"
 *             NIM: 12345678
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "berhasil buat user"
 *               data:
 *                 employeeData:
 *                   _id: "65e6789abcd1234567890ef"
 *                   name: "Joko Barista"
 *                   email: "joko@kopi.com"
 *                   role: "Mahasiswa"
 *                   NIM: 12345678
 *                   photo: "https://res.cloudinary.com/.../joko.jpg"
 *                   createdAt: "2024-03-05T12:00:00.000Z"
 *                   updatedAt: "2024-03-05T12:00:00.000Z"
 *                   __v: 0
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   get:
 *     summary: Get current logged in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "berhasil dapet user"
 *               data: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "berhasil hapus user"
 *               data: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

userRouter.post(
  "/",
  [verifyToken, upload.single("photo"), validate(userSchema)],
  createUser,
);

userRouter.get("/", [verifyToken], getUser);

userRouter.delete(
  "/:id",
  [verifyToken, isUserAuthorized([Roles.Admin])],
  deleteUser,
);

export default userRouter;
