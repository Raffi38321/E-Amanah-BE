import { Router } from "express";
import {
  pengajuanKlaimActionSchema,
  pengajuanKlaimSchema,
} from "../validators/pengajuanKlaim.validator";
import verifyToken from "../middlewares/acl.middleware";
import upload from "../middlewares/multer.middleware";
import { validate } from "../middlewares/reqBody.middleware";
import {
  createPengajuan,
  getAllPengajuanKlaimIsPending,
  getKlaimById,
  pengajuanKlaimAction,
} from "../controllers/pengajuanKlaim.controller";
import isUserAuthorized from "../middlewares/rbac.middleware";
import Roles from "../utils/Role";

const pengajuanKlaimRouter = Router();

/**
 * @swagger
 * /pengajuan-klaim:
 *   post:
 *     summary: Buat pengajuan klaim barang
 *     tags: [PengajuanKlaim]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - deskripsiBarang
 *               - idLaporan
 *             properties:
 *               deskripsiBarang:
 *                 type: string
 *               idLaporan:
 *                 type: string
 *                 description: ID dari laporan barang yang diklaim
 *               photo:
 *                 type: string
 *                 format: binary
 *           example:
 *             deskripsiBarang: "Laptop saya warna hitam dengan stiker merah"
 *             idLaporan: "65e6789abcd12345e6789f"
 *     responses:
 *       201:
 *         description: Pengajuan klaim berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil bikin klaim"
 *               data:
 *                 pengajuan:
 *                   _id: "65f1234abcd56789ef012345"
 *                   deskripsiBarang: "Laptop saya warna hitam dengan stiker merah"
 *                   idLaporan: "65e6789abcd12345e6789f"
 *                   klaimBy: "65eabcd1234567890abcdef"
 *                   photo: "https://res.cloudinary.com/.../klaim.jpg"
 *                   status: "Pending"
 *                   createdAt: "2024-03-06T08:00:00.000Z"
 *                   updatedAt: "2024-03-06T08:00:00.000Z"
 *                   __v: 0
 *       400:
 *         description: Bad request (validasi gagal)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laporan tidak ditemukan
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get semua pengajuan klaim status Pending (Admin only)
 *     tags: [PengajuanKlaim]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: List pengajuan klaim pending
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil dapetin semua klaim pending"
 *               data:
 *                 klaims:
 *                   - _id: "65f1234abcd56789ef012345"
 *                     status: "Pending"
 *                     deskripsiBarang: "Laptop saya warna hitam"
 *                     photo: "null"
 *                     klaimBy:
 *                       _id: "65eabcd1234567890abcdef"
 *                       name: "Muhammad Raffi"
 *                       email: "raffi@gmail.com"
 *                     idLaporan:
 *                       _id: "65e6789abcd12345e6789f"
 *                       name: "Laptop Asus"
 *                       kategori: "Elektronik"
 *                       lokasi: "Ruang Lab Informatika"
 *                     createdAt: "2024-03-06T08:00:00.000Z"
 *                     updatedAt: "2024-03-06T08:00:00.000Z"
 *                 pagination:
 *                   currentPage: 1
 *                   totalPages: 5
 *                   totalData: 50
 *                   limit: 10
 *                   hasNextPage: true
 *                   hasPrevPage: false
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (bukan Admin)
 *       500:
 *         description: Server error
 *
 * /pengajuan-klaim/action/{id}:
 *   put:
 *     summary: Approve atau reject pengajuan klaim (Admin only)
 *     tags: [PengajuanKlaim]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pengajuan klaim
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Success, Rejected]
 *           example:
 *             status: "Success"
 *     responses:
 *       200:
 *         description: Status klaim berhasil diupdate
 *         content:
 *           application/json:
 *             example:
 *               status: "succes"
 *               message: "berhasil action"
 *               data:
 *                 pengajuan:
 *                   _id: "65f1234abcd56789ef012345"
 *                   status: "Success"
 *                   deskripsiBarang: "Laptop saya warna hitam dengan stiker merah"
 *                   idLaporan: "65e6789abcd12345e6789f"
 *                   klaimBy: "65eabcd1234567890abcdef"
 *                   photo: "null"
 *                   createdAt: "2024-03-06T08:00:00.000Z"
 *                   updatedAt: "2024-03-06T09:00:00.000Z"
 *                   __v: 0
 *       400:
 *         description: Bad request (status tidak valid)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (bukan Admin)
 *       404:
 *         description: Pengajuan klaim tidak ditemukan
 *       500:
 *         description: Server error
 */

pengajuanKlaimRouter.post(
  "/",
  [verifyToken, upload.single("photo"), validate(pengajuanKlaimSchema)],
  createPengajuan,
);

pengajuanKlaimRouter.get(
  "/",
  [verifyToken, isUserAuthorized([Roles.Admin])],
  getAllPengajuanKlaimIsPending,
);

pengajuanKlaimRouter.get("/:id", [validate], getKlaimById);

pengajuanKlaimRouter.put(
  "/action/:id",
  [
    verifyToken,
    isUserAuthorized([Roles.Admin]),
    validate(pengajuanKlaimActionSchema),
  ],
  pengajuanKlaimAction,
);

export default pengajuanKlaimRouter;
