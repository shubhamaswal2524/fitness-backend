import { Request, Response, NextFunction } from "express";

type Role = "admin" | "user" | "trainer" | string;

export const authorizeRoles = (...allowedRoles: Role[]): any => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req?.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
