import type { Request, Response } from "express";
import response from "../utils/response";
import Klaim from "../models/pengajuanKlaim.model";
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
      return response.notFound(res, "klaim ga ada");
    }
    response.successWithData(res, "berhasil action", { pengajuan });
  } catch (error) {
    response.serverError(res, "rusak pas bikin pengajuan");
  }
};
