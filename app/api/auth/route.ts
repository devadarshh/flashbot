import getScalekit from "@/lib/scalekit";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    (await cookies()).set("sk_state", state, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    const host = req.headers.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    const options = {
      scopes: ["openid", "profile", "email", "offline_access"],
      state,
    };

    const scalekit = getScalekit();
    const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, options);

    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 },
    );
  }
}
