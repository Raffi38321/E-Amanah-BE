import type { Request, Response } from "express";
import response from "../utils/response";
import cloudinary from "../utils/cloudinary";
import LaporBarang from "../models/laporBarang.model";

export const createLaporan = async (req: Request, res: Response) => {
  try {
    const { name, kategori, lokasi, tanggal, deskripsiBarang } = req.body;

    let photoUrl = null;

    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "lapor" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file!.buffer);
      });

      photoUrl = result.secure_url;
    }

    const lapor = await LaporBarang.create({
      name,
      kategori,
      lokasi,
      tanggal,
      deskripsiBarang,
      photo: photoUrl,
    });

    response.successCreate(res, "berhasil buat lapor", 201, { lapor });
  } catch (error) {
    console.log(error);
    response.serverError(res, "gagal pas buat lapor");
  }
};

export const deleteLaporanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lapor = await LaporBarang.findByIdAndDelete(id);
    if (!lapor) {
      return response.notFound(res, " ga ketemu");
    }
    response.success(res, "berhasil hapus ");
  } catch (error: any) {
    console.log(error);
    if (error.name === "CastError" || error.kind === "ObjectId") {
      return response.clientError(res, "ID tidak valid");
    }
    return response.serverError(res, "gagal pas hapus laporan");
  }
};
