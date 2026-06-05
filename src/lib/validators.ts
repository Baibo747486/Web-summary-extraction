const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
];

function isPrivate172(hostname: string) {
  const match = hostname.match(/^172\.(\d+)\./);
  if (!match) return false;
  const second = Number(match[1]);
  return second >= 16 && second <= 31;
}

function isPrivateHostname(hostname: string) {
  const normalized = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(normalized)) || isPrivate172(normalized);
}

export function validateHttpUrl(input: unknown): string {
  if (typeof input !== "string" || input.trim().length === 0) {
    throw new Error("请输入需要提取的网页地址。");
  }

  const value = input.trim();

  if (value.length > 2048) {
    throw new Error("网址太长了，请换一个更短的链接。");
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("网址格式不正确，请输入完整的 http 或 https 链接。");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("仅支持 http 和 https 网页链接。");
  }

  if (isPrivateHostname(url.hostname)) {
    throw new Error("出于安全考虑，暂不支持访问本地或内网地址。");
  }

  return url.toString();
}
