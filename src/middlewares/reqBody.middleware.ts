import { ZodObject } from "zod";
import type { Request, Response, NextFunction } from "express";
import response from "../utils/response";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      response.clientError(res, error.message);
    }
  };
