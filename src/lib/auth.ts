import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secure-shubox-secret-key-that-is-long");

// Payload types
export interface UserJwtPayload {
  userId: number;
  mobile: string;
  fullName: string;
}

export async function signToken(payload: UserJwtPayload): Promise<string> {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
    
  return jwt;
}

export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserJwtPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<UserJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  
  return verifyToken(token);
}

export async function setSessionCookie(payload: UserJwtPayload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
