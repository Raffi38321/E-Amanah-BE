import { Router } from "express";
import verifyToken from "../middlewares/acl.middleware";
import { validate } from "../middlewares/reqBody.middleware";
import upload from "../middlewares/multer.middleware";
import {
  createLaporan,
  deleteLaporanById,
} from "../controllers/laporBarang.controller";
import { laporBarangSchema } from "../validators/laporBarang.validator";

const laporBarangRouter = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *               - price
 *               - isAvailable
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *               stock:
 *                 type: number
 *               photo:
 *                 type: string
 *                 format: binary
 *           example:
 *             name: "Kopi Susu Gula Aren"
 *             price: 25000
 *             isAvailable: true
 *             stock: 100
 *             photo: (binary file)
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil buat product"
 *               data:
 *                 product:
 *                   _id: "65e6789abcd12345e6789f"
 *                   name: "Kopi Susu Gula Aren"
 *                   price: 25000
 *                   isAvailable: true
 *                   stock: 100
 *                   photo: "https://res.cloudinary.com/.../kopi.jpg"
 *                   createdAt: "2024-03-05T13:00:00.000Z"
 *                   updatedAt: "2024-03-05T13:00:00.000Z"
 *                   __v: 0
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil dapetin semua product"
 *               data:
 *                 products:
 *                   - _id: "65e6789abcd12345e6789f"
 *                     name: "Kopi Susu Gula Aren"
 *                     price: 25000
 *                     isAvailable: true
 *                     stock: 100
 *                     photo: null
 *                     createdAt: "2024-03-05T13:00:00.000Z"
 *                     updatedAt: "2024-03-05T13:00:00.000Z"
 *                     __v: 0
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *               stock:
 *                 type: number
 *           example:
 *             name: "Kopi Susu Gula Aren Large"
 *             price: 30000
 *             isAvailable: false
 *             stock: 0
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */

laporBarangRouter.post(
  "/",
  [verifyToken, upload.single("photo"), validate(laporBarangSchema)],
  createLaporan,
);

laporBarangRouter.delete("/:id", [verifyToken], deleteLaporanById);

export default laporBarangRouter;
