import jwt from "jsonwebtoken";
import response from "../utils/response";
import type { NextFunction, Request, Response } from "express";
import ENV from "../utils/ENV";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return response.unauthorized(res, "token ga ada");
  }

  const [bearer, token] = tokenHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return response.unauthorized(res, "format token salah");
  }

  jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return response.forbidden(res, "token ga valid");
    }

    const payload = decoded as jwt.JwtPayload;

    (req as any).employee = {
      userId: payload.employeeId,
      role: payload.employeeRole,
    };
    next();
  });
};

export default verifyToken;
