import { NextResponse } from "next/server";

import { extractArticleFromUrl } from "@/lib/extract";
import { summarizeArticle } from "@/lib/summarize";
import { validateHttpUrl } from "@/lib/validators";

export const runtime = "nodejs";

function toClientError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "摘要生成失败，请稍后再试。";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown };
    const sourceUrl = validateHttpUrl(body.url);
    const article = await extractArticleFromUrl(sourceUrl);
    const summary = await summarizeArticle({
      title: article.title,
      content: article.content,
      url: sourceUrl,
    });

    return NextResponse.json({
      title: article.title,
      summary,
      sourceUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: toClientError(error),
      },
      { status: 400 },
    );
  }
}
