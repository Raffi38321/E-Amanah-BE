import {
  createUser,
  getUser,
  deleteUser,
} from "../controllers/user.controller";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import cloudinary from "../utils/cloudinary";

jest.mock("../models/user.model");
jest.mock("bcrypt");
jest.mock("../utils/cloudinary", () => ({
  default: { uploader: { upload_stream: jest.fn() } },
}));
jest.mock("../utils/ENV", () => ({
  default: { SALT_BYCRYPT: 10 },
}));

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("createUser", () => {
  it("berhasil buat user dan return 201", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    const fakeUser = {
      toObject: () => ({
        _id: "u1",
        name: "Budi",
        email: "budi@test.com",
        password: "hashed-password",
        role: "Mahasiswa",
        NIM: 12345,
      }),
    };
    (User.create as jest.Mock).mockResolvedValue(fakeUser);

    const req = {
      body: {
        name: "Budi",
        email: "budi@test.com",
        password: "123456",
        role: "Mahasiswa",
        NIM: 12345,
      },
      file: null,
    } as any;
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall.data.employeeData).not.toHaveProperty("password");
  });

  it("returns 500 jika terjadi error", async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("bcrypt error"));
    const req = {
      body: { name: "Budi", email: "budi@test.com", password: "123456" },
      file: null,
    } as any;
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getUser", () => {
  it("returns 404 jika user tidak ditemukan", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);
    const req = { employee: { userId: "u1" } } as any;
    const res = mockRes();

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 200 jika user ditemukan", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ _id: "u1", name: "Budi" });
    const req = { employee: { userId: "u1" } } as any;
    const res = mockRes();

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("deleteUser", () => {
  it("returns 404 jika user tidak ditemukan", async () => {
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "u1" } } as any;
    const res = mockRes();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 200 jika user berhasil dihapus", async () => {
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "u1" });
    const req = { params: { id: "u1" } } as any;
    const res = mockRes();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
