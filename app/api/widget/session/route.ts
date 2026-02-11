import { db } from "@/db/client";
import { chatBotMetadata, metadata } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://flashsupport.nitishyadav.xyz", // Start keeping the production as well just in case
];

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  try {
    const { widget_id } = await req.json();

    if (!widget_id) {
      return NextResponse.json({ error: "Missing widget_id" }, { status: 400 });
    }

    // Verify widget exists
    const [bot] = await db
      .select()
      .from(chatBotMetadata)
      .where(eq(chatBotMetadata.id, widget_id))
      .limit(1);

    if (!bot) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    // Check allowed origins
    let allowedOrigin = "";

    // 1. Check strict allowlist (localhosts)
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      allowedOrigin = origin;
    }
    // 2. Check user's website_url
    else if (origin) {
      const [userMeta] = await db
        .select()
        .from(metadata)
        .where(eq(metadata.user_email, bot.user_email))
        .limit(1);

      if (userMeta?.website_url) {
        // Normalize URLs for comparison (remove trailing slashes)
        const normalize = (url: string) => url.replace(/\/$/, "");
        if (normalize(origin) === normalize(userMeta.website_url)) {
          allowedOrigin = origin;
        }
      }
    }

    // If no allowed origin found and origin is present (CORS request), block it
    // If allow-origin is *, we usually set it to *, but here we want strict.
    // However, if we want to be nice to non-browser tools (like curl without origin), we might skip this.
    // But for a widget, we expect browsers.

    if (origin && !allowedOrigin) {
      return NextResponse.json(
        { error: "Origin not allowed" },
        { status: 403 },
      );
    }

    // If no origin header (e.g. server-side fetch), we might default to * or null,
    // but here we only care about setting the header if we have an origin.
    // If allowedOrigin is set, we use it.

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const sessionId = crypto.randomUUID();

    const token = await new SignJWT({
      widgetId: bot.id,
      ownerEmail: bot.user_email,
      sessionId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    const response = NextResponse.json({ token });

    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );
    }

    return response;
  } catch (error) {
    console.error("Session Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  // We allow all origins for OPTIONS to avoid database lookups during preflight.
  // The actual security check is performed in the POST handler.
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
