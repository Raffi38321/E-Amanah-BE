import type { Request, Response } from "express";
import response from "../utils/response";
import cloudinary from "../utils/cloudinary";
import LaporBarang from "../models/laporBarang.model";

export const createLaporan = async (req: Request, res: Response) => {
  try {
    const { name, kategori, lokasi, tanggal, deskripsiBarang } = req.body;
    const { userId } = (req as any).employee;
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
      laporBy: userId,
    });

    response.successCreate(res, "berhasil buat lapor", 201, { lapor });
  } catch (error) {
    console.log(error);
    response.serverError(res, "gagal pas buat lapor");
  }
};

export const getAllLaporBarangIsNotClaimed = async (
  req: Request,
  res: Response,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      isClaimed: false,
    };

    const totalData = await LaporBarang.countDocuments(filter);

    const laporans = await LaporBarang.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("laporBy", "name");

    const totalPages = Math.ceil(totalData / limit);

    response.successWithData(res, "berhasil dapetin semua laporan", {
      laporans,
      pagination: {
        currentPage: page,
        totalPages,
        totalData,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    response.serverError(res, "gagal pas dapetin semua laporbarang");
  }
};

export const getLaporanByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laporan = await LaporBarang.findById(id);
    if (!laporan) {
      return response.notFound(res, "laporan ga adas");
    }

    response.successWithData(res, "berhasil dapaet laporan", { laporan });
  } catch (error) {
    response.serverError(res, "gagal pas dapetin laporbarang");
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
    // console.log(error);
    if (error.name === "CastError" || error.kind === "ObjectId") {
      return response.clientError(res, "ID tidak valid");
    }
    return response.serverError(res, "gagal pas hapus laporan");
  }
};
