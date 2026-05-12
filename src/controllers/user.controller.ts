import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import response from "../utils/response";
import ENV from "../utils/ENV";
import cloudinary from "../utils/cloudinary";
import User from "../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password, role, NIM } = req.body;
    const hashPassword = await bcrypt.hash(password, ENV.SALT_BYCRYPT);

    let photoUrl = null;

    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file!.buffer);
      });
      photoUrl = result.secure_url;
    }
    const user = await User.create({
      email,
      password: hashPassword,
      name,
      role,
      photo: photoUrl,
      NIM: Number(NIM),
    });
    const { password: _, ...employeeData } = user.toObject();

    return response.successCreate(res, "berhasil buat user", 201, {
      employeeData,
    });
  } catch (error: any) {
    return response.serverError(res, error.message);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).employee;
    const user = await User.findById(userId);
    if (!user) {
      return response.notFound(res, "user ga ketemu");
    }

    response.success(res, "berhasil dapet user");
  } catch (error) {
    return response.serverError(res, "gagal pas getUser");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return response.notFound(res, "user ga ketemu");
    }

    response.success(res, "berhasil hapus user");
  } catch (error) {
    return response.serverError(res, "gagal pas deleteUser");
  }
};
