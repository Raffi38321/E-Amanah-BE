import { Router } from "express";
import { validate } from "../middlewares/reqBody.middleware";
import { employeeSchema } from "../validators/user.validator";
import upload from "../middlewares/multer.middleware";
import verifyToken from "../middlewares/acl.middleware";
import isUserAuthorized from "../middlewares/rbac.middleware";
import Roles from "../utils/Role";
import {
  createUser,
  deleteUser,
  getUser,
} from "../controllers/employee.controller";

const userRouter = Router();

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
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
 *               - role
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
 *               photo:
 *                 type: string
 *                 format: binary
 *           example:
 *             name: "Joko Barista"
 *             email: "joko@kopi.com"
 *             password: "passwordsuperkuat"
 *             role: "barista"
 *             photo: (binary file)
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil buat user"
 *               data:
 *                 employeeData:
 *                   _id: "65e6789abcd1234567890ef"
 *                   name: "Joko Barista"
 *                   email: "joko@kopi.com"
 *                   role: "barista"
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
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil dapetin semua user"
 *               data:
 *                 employees:
 *                   - _id: "65eabcd1234567890abcdef"
 *                     name: "Budi Admin"
 *                     email: "admin@kopi.com"
 *                     role: "admin"
 *                     photo: null
 *                     createdAt: "2024-03-05T10:00:00.000Z"
 *                     updatedAt: "2024-03-05T10:00:00.000Z"
 *                     __v: 0
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

userRouter.post(
  "/",
  [verifyToken, upload.single("photo"), validate(employeeSchema)],
  createUser,
);

userRouter.get("/", [verifyToken], getUser);

userRouter.delete(
  "/:id",
  [verifyToken, isUserAuthorized([Roles.Admin])],
  deleteUser,
);

export default userRouter;
