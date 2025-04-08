import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): Response | any => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied. No Token Provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid Token" });
  }
};

export default authMiddleware;
