import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeMarkdown } from "@/lib/openAI";
import { NextRequest, NextResponse } from "next/server";
import { getDocumentProxy, extractText } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let type: string;
    let body: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      type = formData.get("type") as string;

      if (type === "upload") {
        const file = formData.get("file") as File;

        if (!file) {
          return NextResponse.json(
            { error: "No file provided" },
            { status: 400 },
          );
        }

        let fileContent = "";
        const fileExtension = file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf("."));
        let metaData: any = {
          fileName: file.name,
          fileSize: file.size,
        };

        if (fileExtension === ".pdf") {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
          const { text, totalPages } = await extractText(pdf);
          fileContent = text;
          metaData.pageCount = totalPages;
        } else {
          fileContent = await file.text();
          if (fileExtension === ".csv") {
            const lines = fileContent.split("\n").filter((line) => line.trim());
            metaData.rowCount = lines.length - 1;
            metaData.headers = lines[0]?.split(",").map((h) => h.trim());
          }
        }

        const markdown = await summarizeMarkdown(fileContent);

        await db.insert(knowledge_source).values({
          user_email: user.email,
          type: "upload",
          name: file.name,
          status: "active",
          content: markdown,
          meta_data: JSON.stringify(metaData),
        });

        return NextResponse.json(
          {
            message: `${fileExtension.toUpperCase().replace(".", "")} file uploaded and processed successfully`,
          },
          { status: 200 },
        );
      }
    } else {
      body = await req.json();
      type = body.type;
    }
    if (type === "website") {
      const zenUrl = new URL("https://api.zenrows.com/v1/");
      zenUrl.searchParams.set("apikey", process.env.ZENROWS_API_KEY!);
      zenUrl.searchParams.set("url", body.url);
      zenUrl.searchParams.set("response_type", "markdown");

      const res = await fetch(zenUrl.toString(), {
        headers: {
          "User-Agent": "FlashSupportBot/1.0",
        },
      });

      const html = await res.text();

      if (!res.text) {
        return NextResponse.json(
          {
            error: "ZenRows request failed",
            status: res.status,
            body: html.slice(0, 500),
          },
          { status: 502 },
        );
      }

      const markdown = await summarizeMarkdown(html);

      await db.insert(knowledge_source).values({
        user_email: user.email,
        type: "website",
        name: body.url,
        status: "active",
        source_url: body.url,
        content: markdown,
      });
    } else if (type === "text") {
      let content = body.content;

      if (body.content.length > 500) {
        const markdown = await summarizeMarkdown(body.content);
        content = markdown;
      }

      await db.insert(knowledge_source).values({
        user_email: user.email,
        type: "text",
        name: body.title,
        status: "active",
        content: content,
      });
    }

    return NextResponse.json(
      { message: "Source added successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in knowledge store:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
