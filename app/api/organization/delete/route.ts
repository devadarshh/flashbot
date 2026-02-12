import { db } from "@/db/client";
import {
  chatBotMetadata,
  knowledge_source,
  metadata,
  sections,
  teamMembers,
  widgets,
} from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, organization_id } = user;

    if (!email || !organization_id) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    // Delete related data
    // Note: We are not deleting the user record itself, just the workspace data
    // Transctions would be better here but for now we do individual deletes as per plan

    await db.delete(metadata).where(eq(metadata.user_email, email));

    // Knowledge sources
    await db
      .delete(knowledge_source)
      .where(eq(knowledge_source.user_email, email));

    // Sections
    await db.delete(sections).where(eq(sections.user_email, email));

    // Chatbot metadata
    await db
      .delete(chatBotMetadata)
      .where(eq(chatBotMetadata.user_email, email));

    // Widgets - based on organization_id as per schema
    await db
      .delete(widgets)
      .where(eq(widgets.organization_id, organization_id));

    // Team members - based on organization_id
    await db
      .delete(teamMembers)
      .where(eq(teamMembers.organization_id, organization_id));

    // Sign out user by deleting the session cookie
    const cookieStore = await cookies();
    cookieStore.delete("user_session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
