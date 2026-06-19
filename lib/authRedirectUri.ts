import { NextRequest } from "next/server";

export function getAuthRedirectUri(req: NextRequest): string {
  if (process.env.SCALEKIT_REDIRECT_URI) {
    return process.env.SCALEKIT_REDIRECT_URI;
  }

  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost:3000";
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const protocol = forwardedProto
    ? forwardedProto
    : process.env.NODE_ENV === "production"
      ? "https"
      : "http";

  return `${protocol}://${host}/api/auth/callback`;
}
