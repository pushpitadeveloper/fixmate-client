import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Better Auth er default ugly error page /api/auth/error user kokhono dekhbe na
// Error hole amader sundor /sign-in page e pathabo
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  // Google callback fail korle Better Auth /api/auth/error e pathay
  if (url.pathname.endsWith("/api/auth/error")) {
    const error = url.searchParams.get("error") || "unknown";
    return NextResponse.redirect(new URL(`/sign-in?error=${error}`, req.url));
  }
  return auth.handler(req);
}

export async function POST(req: NextRequest) {
  return auth.handler(req);
}
