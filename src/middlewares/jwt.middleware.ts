// middleware/jwtAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Users from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  // add other fields if your token includes them
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await Users.findByPk(decoded.id);
    if (!user || user.userAccessToken !== token) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    // @ts-ignore - attach user info to request (optional)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default jwtAuth;
