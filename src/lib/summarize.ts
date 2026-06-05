import OpenAI from "openai";

export type SummarizeInput = {
  title: string;
  content: string;
  url: string;
};

function createClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey?.trim()) {
    throw new Error("请先在 .env.local 中配置 OPENAI_API_KEY 或 DEEPSEEK_API_KEY 环境变量。");
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com",
  });
}

export async function summarizeArticle(input: SummarizeInput) {
  const client = createClient();
  const model = process.env.OPENAI_MODEL || "deepseek-chat";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "你是一个专业的信息整理助手。你必须用中文输出，摘要准确、简洁，不编造原文不存在的信息。",
      },
      {
        role: "user",
        content: `请阅读下面的网页内容，并用中文生成简洁摘要。\n\n要求：\n1. 无论原文是中文还是英文，都必须用中文回答。\n2. 摘要控制在 150-300 字。\n3. 重点概括核心观点、结论和关键信息。\n4. 不要编造原文不存在的信息。\n5. 如果内容信息不足，请说明“该网页可提取内容较少”。\n\n网页标题：\n${input.title}\n\n网页链接：\n${input.url}\n\n网页正文：\n${input.content}`,
      },
    ],
  });

  const summary = completion.choices[0]?.message?.content?.trim();

  if (!summary) {
    throw new Error("AI 暂时没有生成摘要，请稍后重试。");
  }

  return summary;
}
