import type { Request, Response, NextFunction } from "express";
import { verifyToken, COOKIE_NAME, type JwtPayload } from "../lib/auth";

// Extend Express Request to carry admin user info
declare global {
  namespace Express {
    interface Request {
      adminUser?: JwtPayload;
    }
  }
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.adminUser = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
