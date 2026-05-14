import {
  createLaporan,
  deleteLaporanById,
  getAllLaporBarangIsNotClaimed,
  getLaporanByid,
} from "../controllers/laporBarang.controller";
import { Response } from "express";
import LaporBarang from "../models/laporBarang.model";

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

// ─── createLaporan ────────────────────────────────────────────────────────────

describe("createLaporan", () => {
  it("returns 201 jika berhasil buat laporan tanpa foto", async () => {
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
      employee: { userId: "u1" },
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
      employee: { userId: "u1" },
    } as any;
    const res = mockRes();

    await createLaporan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── getAllLaporBarangIsNotClaimed ─────────────────────────────────────────────

describe("getAllLaporBarangIsNotClaimed", () => {
  it("returns 200 dengan data dan pagination", async () => {
    const fakeLaporans = [{ _id: "l1", name: "Laptop", isClaimed: false }];
    (LaporBarang.countDocuments as jest.Mock).mockResolvedValue(1);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(fakeLaporans),
    };
    (LaporBarang.find as jest.Mock).mockReturnValue(mockQuery);

    const req = { query: { page: "1", limit: "10" } } as any;
    const res = mockRes();

    await getAllLaporBarangIsNotClaimed(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          laporans: fakeLaporans,
          pagination: expect.objectContaining({ currentPage: 1, totalData: 1 }),
        }),
      }),
    );
  });

  it("returns 200 dengan default page dan limit jika query kosong", async () => {
    (LaporBarang.countDocuments as jest.Mock).mockResolvedValue(0);
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    };
    (LaporBarang.find as jest.Mock).mockReturnValue(mockQuery);

    const req = { query: {} } as any;
    const res = mockRes();

    await getAllLaporBarangIsNotClaimed(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 500 jika terjadi error", async () => {
    (LaporBarang.countDocuments as jest.Mock).mockRejectedValue(
      new Error("db error"),
    );
    const req = { query: {} } as any;
    const res = mockRes();

    await getAllLaporBarangIsNotClaimed(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── getLaporanByid ───────────────────────────────────────────────────────────

describe("getLaporanByid", () => {
  it("returns 404 jika laporan tidak ditemukan", async () => {
    (LaporBarang.findById as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "l1" } } as any;
    const res = mockRes();

    await getLaporanByid(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 200 dengan data laporan", async () => {
    const fakeLaporan = { _id: "l1", name: "Laptop" };
    (LaporBarang.findById as jest.Mock).mockResolvedValue(fakeLaporan);
    const req = { params: { id: "l1" } } as any;
    const res = mockRes();

    await getLaporanByid(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ laporan: fakeLaporan }),
      }),
    );
  });

  it("returns 500 jika terjadi error", async () => {
    (LaporBarang.findById as jest.Mock).mockRejectedValue(
      new Error("db error"),
    );
    const req = { params: { id: "l1" } } as any;
    const res = mockRes();

    await getLaporanByid(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── deleteLaporanById ────────────────────────────────────────────────────────

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
