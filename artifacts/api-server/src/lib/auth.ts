import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.SESSION_SECRET ||
  "bec-admin-secret-change-me";

const JWT_EXPIRY = "24h";

export interface JwtPayload {
  userId: number;
  email: string;
}

export function signToken(userId: number, email: string): string {
  return jwt.sign({ userId, email } satisfies JwtPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export const COOKIE_NAME = "bec_admin_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: "/",
};
