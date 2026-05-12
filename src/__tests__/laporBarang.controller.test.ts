import {
  createLaporan,
  deleteLaporanById,
} from "../controllers/laporBarang.controller";
import { Request, Response } from "express";
import LaporBarang from "../models/laporBarang.model";
import cloudinary from "../utils/cloudinary";

jest.mock("../models/laporBarang.model");
jest.mock("../utils/cloudinary", () => ({
  default: { uploader: { upload_stream: jest.fn() } },
}));

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("createLaporan", () => {
  it("berhasil buat laporan tanpa foto dan return 201", async () => {
    const fakeLapor = {
      _id: "l1",
      name: "Laptop",
      kategori: "Elektronik",
      lokasi: "Gedung A",
      tanggal: new Date("2024-01-01"),
      deskripsiBarang: "Laptop hitam",
      photo: null,
    };
    (LaporBarang.create as jest.Mock).mockResolvedValue(fakeLapor);

    const req = {
      body: {
        name: "Laptop",
        kategori: "Elektronik",
        lokasi: "Gedung A",
        tanggal: "2024-01-01",
        deskripsiBarang: "Laptop hitam",
      },
      file: null,
    } as any;
    const res = mockRes();

    await createLaporan(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ lapor: fakeLapor }),
      }),
    );
  });

  it("returns 500 jika terjadi error", async () => {
    (LaporBarang.create as jest.Mock).mockRejectedValue(new Error("db error"));
    const req = {
      body: {
        name: "Laptop",
        kategori: "Elektronik",
        lokasi: "Gedung A",
        tanggal: "2024-01-01",
        deskripsiBarang: "desc",
      },
      file: null,
    } as any;
    const res = mockRes();

    await createLaporan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("deleteLaporanById", () => {
  it("returns 404 jika laporan tidak ditemukan", async () => {
    (LaporBarang.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "l1" } } as any;
    const res = mockRes();

    await deleteLaporanById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 200 jika laporan berhasil dihapus", async () => {
    (LaporBarang.findByIdAndDelete as jest.Mock).mockResolvedValue({
      _id: "l1",
    });
    const req = { params: { id: "l1" } } as any;
    const res = mockRes();

    await deleteLaporanById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 400 jika ID tidak valid (CastError)", async () => {
    const castError: any = new Error("Cast error");
    castError.name = "CastError";
    castError.kind = "ObjectId";
    (LaporBarang.findByIdAndDelete as jest.Mock).mockRejectedValue(castError);
    const req = { params: { id: "invalid-id" } } as any;
    const res = mockRes();

    await deleteLaporanById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "ID tidak valid" }),
    );
  });
});
