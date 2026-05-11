import "express";

declare global {
  namespace Express {
    interface Request {
      employee?: {
        userId: string;
        role: string;
      };
    }
  }
}
