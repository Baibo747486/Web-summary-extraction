import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";

const FETCH_TIMEOUT_MS = 15_000;
const MAX_HTML_CHARS = 1_500_000;
const MIN_CONTENT_CHARS = 200;
const MAX_CONTENT_CHARS = 12_000;

export type ExtractedArticle = {
  title: string;
  content: string;
  excerpt?: string;
};

export function cleanText(text: string) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[\t\f\v]+/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

function normalizeCharset(charset: string) {
  const normalized = charset.trim().toLowerCase();
  if (["gb2312", "gbk", "gb18030"].includes(normalized)) return "gb18030";
  return normalized || "utf-8";
}

function detectCharsetFromHtml(bytes: ArrayBuffer) {
  const asciiPreview = new TextDecoder("latin1").decode(bytes.slice(0, 4096));
  const match = asciiPreview.match(/<meta[^>]+charset=["']?\s*([^\s"'>/]+)/i);
  return match?.[1] ? normalizeCharset(match[1]) : undefined;
}

function decodeHtml(bytes: ArrayBuffer, contentType: string) {
  const headerCharset = contentType.match(/charset=([^;]+)/i)?.[1];
  const charset = normalizeCharset(headerCharset || detectCharsetFromHtml(bytes) || "utf-8");

  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

export async function fetchHtml(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error("目标网页无法访问，请检查链接是否有效。");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error("当前仅支持普通网页内容提取。");
    }

    const bytes = await response.arrayBuffer();
    const html = decodeHtml(bytes, contentType);
    if (html.length > MAX_HTML_CHARS) {
      return html.slice(0, MAX_HTML_CHARS);
    }

    return html;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("网页请求超时，请稍后再试。");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("网页抓取失败，请换一个链接试试。");
  } finally {
    clearTimeout(timer);
  }
}

function extractWithReadability(html: string, url: string): ExtractedArticle | null {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article?.textContent) {
    return null;
  }

  const content = cleanText(article.textContent);
  if (!content) return null;

  return {
    title: cleanText(article.title || dom.window.document.title || "未命名网页"),
    content,
    excerpt: article.excerpt ? cleanText(article.excerpt) : undefined,
  };
}

function fallbackExtractWithCheerio(html: string): ExtractedArticle | null {
  const $ = cheerio.load(html);

  $("script, style, noscript, svg, canvas, iframe, nav, footer, header, aside, form").remove();

  const title = cleanText($("title").first().text() || $("h1").first().text() || "未命名网页");
  const candidates = [
    $("article").text(),
    $("main").text(),
    $('[role="main"]').text(),
    $("body").text(),
  ];

  const content = cleanText(candidates.find((item) => cleanText(item).length >= MIN_CONTENT_CHARS) ?? "");

  if (!content) return null;

  return { title, content };
}

export async function extractArticleFromUrl(url: string): Promise<ExtractedArticle> {
  const html = await fetchHtml(url);
  const article = extractWithReadability(html, url) ?? fallbackExtractWithCheerio(html);

  if (!article) {
    throw new Error("无法提取网页正文，请换一个链接试试。");
  }

  const content = cleanText(article.content);

  if (content.length < MIN_CONTENT_CHARS) {
    throw new Error("该网页可提取内容较少，暂时无法生成可靠摘要。");
  }

  return {
    ...article,
    title: article.title || "未命名网页",
    content: content.slice(0, MAX_CONTENT_CHARS),
  };
}
