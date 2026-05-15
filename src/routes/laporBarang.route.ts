import { Router } from "express";
import verifyToken from "../middlewares/acl.middleware";
import { validate } from "../middlewares/reqBody.middleware";
import upload from "../middlewares/multer.middleware";
import {
  createLaporan,
  deleteLaporanById,
  getAllLaporBarangIsNotClaimed,
  getLaporanByid,
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
 *   get:
 *     summary: Get semua laporan barang yang belum diklaim (dengan pagination)
 *     tags: [LaporBarang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Halaman ke berapa
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: List laporan barang
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil dapetin semua laporan"
 *               data:
 *                 laporans:
 *                   - _id: "65e6789abcd12345e6789f"
 *                     name: "Laptop Asus"
 *                     kategori: "Elektronik"
 *                     lokasi: "Gedung A Lt. 2"
 *                     tanggal: "2024-03-05T00:00:00.000Z"
 *                     deskripsiBarang: "Laptop warna hitam"
 *                     photo: "null"
 *                     isClaimed: false
 *                     laporBy:
 *                       _id: "65eabcd1234567890abcdef"
 *                       name: "Budi"
 *                     createdAt: "2024-03-05T13:00:00.000Z"
 *                     updatedAt: "2024-03-05T13:00:00.000Z"
 *                 pagination:
 *                   currentPage: 1
 *                   totalPages: 3
 *                   totalData: 25
 *                   limit: 10
 *                   hasNextPage: true
 *                   hasPrevPage: false
 *       401:
 *         description: Unauthorized
 *
 * /lapor-barang/{id}:
 *   get:
 *     summary: Get laporan barang berdasarkan ID
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
 *         description: Detail laporan barang
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil dapaet laporan"
 *               data:
 *                 laporan:
 *                   _id: "65e6789abcd12345e6789f"
 *                   name: "Laptop Asus"
 *                   kategori: "Elektronik"
 *                   lokasi: "Gedung A Lt. 2"
 *                   tanggal: "2024-03-05T00:00:00.000Z"
 *                   deskripsiBarang: "Laptop warna hitam"
 *                   photo: "null"
 *                   isClaimed: false
 *                   laporBy: "65eabcd1234567890abcdef"
 *                   createdAt: "2024-03-05T13:00:00.000Z"
 *                   updatedAt: "2024-03-05T13:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laporan tidak ditemukan
 *
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
 *               status: "succes"
 *               message: "berhasil hapus"
 *               data: "null"
 *       400:
 *         description: ID tidak valid
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

laporBarangRouter.get("/", [verifyToken], getAllLaporBarangIsNotClaimed);
laporBarangRouter.get("/:id", [verifyToken], getLaporanByid);

laporBarangRouter.delete("/:id", [verifyToken], deleteLaporanById);

export default laporBarangRouter;
