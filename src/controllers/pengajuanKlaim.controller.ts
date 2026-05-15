import type { Request, Response } from "express";
import response from "../utils/response";
import Klaim, { status, statusKlaim } from "../models/pengajuanKlaim.model";
import cloudinary from "../utils/cloudinary";
import LaporBarang from "../models/laporBarang.model";

export const createPengajuan = async (req: Request, res: Response) => {
  try {
    const { deskripsiBarang, idLaporan } = req.body;
    let photoUrl = null;
    const { userId } = (req as any).employee;

    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "klaim" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file!.buffer);
      });
      photoUrl = result.secure_url;
    }
    const laporan = await LaporBarang.findById(idLaporan);
    if (!laporan) {
      return response.notFound(res, "laporan ga ada");
    }
    const pengajuan = await Klaim.create({
      deskripsiBarang,
      photo: photoUrl,
      idLaporan,
      klaimBy: userId,
    });

    response.successCreate(res, "berhasil bikin klaim", 201, { pengajuan });
  } catch (error) {
    response.serverError(res, "rusak ppas bikin pengajuan");
  }
};

export const pengajuanKlaimAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pengajuan = await Klaim.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!pengajuan) {
      return response.notFound(res, "Klaim tidak ditemukan");
    }

    if (status === statusKlaim.Success) {
      await LaporBarang.findByIdAndUpdate(
        pengajuan.idLaporan,
        { isClaimed: true },
        { new: true },
      );
    }

    response.successWithData(res, "Berhasil action pengajuan", pengajuan);
  } catch (error) {
    // console.log(error);

    response.serverError(res, "Terjadi kesalahan saat action pengajuan");
  }
};

export const getAllPengajuanKlaimIsPending = async (
  req: Request,
  res: Response,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      status: statusKlaim.Pending,
    };

    const totalData = await Klaim.countDocuments(filter);

    const klaims = await Klaim.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("klaimBy", "name email")
      .populate({
        path: "idLaporan",
        select: "name kategori lokasi tanggal photo deskripsiBarang isClaimed",
        populate: {
          path: "laporBy",
          select: "name email",
        },
      });

    const totalPages = Math.ceil(totalData / limit);

    response.successWithData(
      res,
      "Berhasil mendapatkan semua pengajuan klaim pending",
      {
        klaims,
        pagination: {
          currentPage: page,
          totalPages,
          totalData,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    );
  } catch (error) {
    // console.log(error);

    response.serverError(res, "Gagal mendapatkan semua pengajuan klaim");
  }
};

export const getKlaimById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const klaim = await Klaim.findById(id);
    if (!klaim) {
      return response.notFound(res, "klaim ga ada");
    }
    const laporan = await LaporBarang.findById(klaim.idLaporan);
    if (!laporan) {
      return response.notFound(res, "laporans ga ada");
    }
    response.successWithData(res, "berhasil dapet pengajuan", {
      klaim,
      laporan,
    });
  } catch (error) {
    response.serverError(res, "Gagal mendapatkan pengajuan klaim by id");
  }
};
