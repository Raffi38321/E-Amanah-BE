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
 * /lapor-barang:
 *   post:
 *     summary: Buat laporan barang baru
 *     tags: [LaporBarang]
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
 *               - kategori
 *               - lokasi
 *               - tanggal
 *               - deskripsiBarang
 *             properties:
 *               name:
 *                 type: string
 *               kategori:
 *                 type: string
 *               lokasi:
 *                 type: string
 *               tanggal:
 *                 type: string
 *                 format: date
 *               deskripsiBarang:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *           example:
 *             name: "Laptop Asus"
 *             kategori: "Elektronik"
 *             lokasi: "Gedung A Lt. 2"
 *             tanggal: "2024-03-05"
 *             deskripsiBarang: "Laptop warna hitam, ada stiker di cover"
 *     responses:
 *       201:
 *         description: Laporan berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "berhasil buat lapor"
 *               data:
 *                 lapor:
 *                   _id: "65e6789abcd12345e6789f"
 *                   name: "Laptop Asus"
 *                   kategori: "Elektronik"
 *                   lokasi: "Gedung A Lt. 2"
 *                   tanggal: "2024-03-05T00:00:00.000Z"
 *                   deskripsiBarang: "Laptop warna hitam, ada stiker di cover"
 *                   photo: "https://res.cloudinary.com/.../laptop.jpg"
 *                   createdAt: "2024-03-05T13:00:00.000Z"
 *                   updatedAt: "2024-03-05T13:00:00.000Z"
 *                   __v: 0
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *
 * /lapor-barang/{id}:
 *   delete:
 *     summary: Hapus laporan barang berdasarkan ID
 *     tags: [LaporBarang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID laporan barang
 *     responses:
 *       200:
 *         description: Laporan berhasil dihapus
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "berhasil hapus"
 *               data: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laporan tidak ditemukan
 */

laporBarangRouter.post(
  "/",
  [verifyToken, upload.single("photo"), validate(laporBarangSchema)],
  createLaporan,
);

laporBarangRouter.delete("/:id", [verifyToken], deleteLaporanById);

export default laporBarangRouter;
