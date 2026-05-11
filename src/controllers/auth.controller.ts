import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import response from "../utils/response";
import ENV from "../utils/ENV";
import User from "../models/user.model";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return response.notFound(res, "user gaketemu");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return response.clientError(res, "password salah");
    }
    const token = jwt.sign(
      { employeeId: user._id, employeeRole: user.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES as any },
    );

    response.successWithData(res, "berhasil bikin token", { token });
  } catch (error) {
    response.serverError(res, "error di login");
  }
};

export const meController = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).employee;
    const user = await User.findById(userId);
    if (!user) {
      return response.notFound(res, "user gaketemu");
    }
    const { password: _, ...employeeData } = user.toObject();
    response.successWithData(res, "berhasil dapet data user", {
      employee: employeeData,
    });
  } catch (error) {
    response.serverError(res, "error dapetin data user");
  }
};
