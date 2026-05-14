import {
  createPengajuan,
  pengajuanKlaimAction,
} from "../controllers/pengajuanKlaim.controller";
import { Response } from "express";
import Klaim from "../models/pengajuanKlaim.model";
import LaporBarang from "../models/laporBarang.model";

jest.mock("../models/pengajuanKlaim.model");
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

// ─── createPengajuan ──────────────────────────────────────────────────────────

describe("createPengajuan", () => {
  it("returns 404 jika laporan tidak ditemukan", async () => {
    (LaporBarang.findById as jest.Mock).mockResolvedValue(null);
    const req = {
      body: { deskripsiBarang: "Laptop saya", idLaporan: "l1" },
      file: null,
      employee: { userId: "u1" },
    } as any;
    const res = mockRes();

    await createPengajuan(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "laporan ga ada" }),
    );
  });

  it("returns 201 jika pengajuan berhasil dibuat tanpa foto", async () => {
    const fakeLaporan = { _id: "l1", name: "Laptop" };
    const fakePengajuan = {
      _id: "k1",
      deskripsiBarang: "Laptop saya",
      idLaporan: "l1",
      klaimBy: "u1",
      photo: null,
      status: "Pending",
    };
    (LaporBarang.findById as jest.Mock).mockResolvedValue(fakeLaporan);
    (Klaim.create as jest.Mock).mockResolvedValue(fakePengajuan);

    const req = {
      body: { deskripsiBarang: "Laptop saya", idLaporan: "l1" },
      file: null,
      employee: { userId: "u1" },
    } as any;
    const res = mockRes();

    await createPengajuan(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ pengajuan: fakePengajuan }),
      }),
    );
  });

  it("returns 500 jika terjadi error", async () => {
    (LaporBarang.findById as jest.Mock).mockRejectedValue(
      new Error("db error"),
    );
    const req = {
      body: { deskripsiBarang: "Laptop saya", idLaporan: "l1" },
      file: null,
      employee: { userId: "u1" },
    } as any;
    const res = mockRes();

    await createPengajuan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── pengajuanKlaimAction ─────────────────────────────────────────────────────

describe("pengajuanKlaimAction", () => {
  it("returns 404 jika klaim tidak ditemukan", async () => {
    (Klaim.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "k1" }, body: { status: "Success" } } as any;
    const res = mockRes();

    await pengajuanKlaimAction(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "klaim ga ada" }),
    );
  });

  it("returns 200 jika status berhasil diupdate ke Success", async () => {
    const updatedKlaim = { _id: "k1", status: "Success" };
    (Klaim.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedKlaim);
    const req = { params: { id: "k1" }, body: { status: "Success" } } as any;
    const res = mockRes();

    await pengajuanKlaimAction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ pengajuan: updatedKlaim }),
      }),
    );
  });

  it("returns 200 jika status berhasil diupdate ke Rejected", async () => {
    const updatedKlaim = { _id: "k1", status: "Rejected" };
    (Klaim.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedKlaim);
    const req = { params: { id: "k1" }, body: { status: "Rejected" } } as any;
    const res = mockRes();

    await pengajuanKlaimAction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 500 jika terjadi error", async () => {
    (Klaim.findByIdAndUpdate as jest.Mock).mockRejectedValue(
      new Error("db error"),
    );
    const req = { params: { id: "k1" }, body: { status: "Success" } } as any;
    const res = mockRes();

    await pengajuanKlaimAction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
