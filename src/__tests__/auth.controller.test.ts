import { loginController, meController } from "../controllers/auth.controller";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

jest.mock("../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../utils/ENV", () => ({
  default: { JWT_SECRET: "test-secret", JWT_EXPIRES: "1d" },
}));

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("loginController", () => {
  it("returns 404 jika user tidak ditemukan", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const req = { body: { email: "x@x.com", password: "123456" } } as Request;
    const res = mockRes();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "failed" }),
    );
  });

  it("returns 400 jika password salah", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ password: "hashed" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const req = { body: { email: "x@x.com", password: "salah" } } as Request;
    const res = mockRes();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns token jika login berhasil", async () => {
    const fakeUser = { _id: "abc123", password: "hashed", role: "Mahasiswa" };
    (User.findOne as jest.Mock).mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fake-token");
    const req = { body: { email: "x@x.com", password: "benar" } } as Request;
    const res = mockRes();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ token: "fake-token" }),
      }),
    );
  });
});

describe("meController", () => {
  it("returns 404 jika user tidak ditemukan", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);
    const req = { employee: { userId: "abc123" } } as any;
    const res = mockRes();

    await meController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns data user tanpa password", async () => {
    const fakeUser = {
      toObject: () => ({
        _id: "abc123",
        name: "Budi",
        email: "budi@test.com",
        password: "hashed",
        role: "Admin",
      }),
    };
    (User.findById as jest.Mock).mockResolvedValue(fakeUser);
    const req = { employee: { userId: "abc123" } } as any;
    const res = mockRes();

    await meController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall.data.employee).not.toHaveProperty("password");
    expect(jsonCall.data.employee).toHaveProperty("name", "Budi");
  });
});
