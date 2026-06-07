"use client";

import { useState } from "react";

import { AnimeBackground } from "@/components/AnimeBackground";
import { LoadingAnime } from "@/components/LoadingAnime";
import { SummaryResult, type SummaryData } from "@/components/SummaryResult";
import { UrlInputCard } from "@/components/UrlInputCard";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SummaryData | null>(null);

  async function handleSubmit() {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("请先输入需要提取的网页地址。");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const responseText = await response.text();
      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          responseText.trim().startsWith("<")
            ? "线上接口返回了网页而不是 JSON。请检查 Vercel 是否已重新部署最新代码，以及 /api/summarize 是否存在。"
            : "线上接口返回格式异常，请稍后重试。",
        );
      }

      const data = JSON.parse(responseText) as Partial<SummaryData> & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "摘要生成失败，请稍后再试。");
      }

      if (!data.title || !data.summary || !data.sourceUrl) {
        throw new Error("摘要结果不完整，请稍后再试。");
      }

      setResult({
        title: data.title,
        summary: data.summary,
        sourceUrl: data.sourceUrl,
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "摘要生成失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimeBackground>
      <div className="w-full max-w-4xl">
        <UrlInputCard url={url} loading={loading} onUrlChange={setUrl} onSubmit={handleSubmit} />

        {error ? (
          <div className="mt-5 rounded-3xl border border-red-200 bg-white/75 px-5 py-4 text-center font-bold text-red-500 shadow-lg backdrop-blur">
            {error}
          </div>
        ) : null}

        {loading ? <LoadingAnime /> : null}
        {result ? <SummaryResult result={result} /> : null}
      </div>
    </AnimeBackground>
  );
}
