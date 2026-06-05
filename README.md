# 小白信息提取

一个简洁美观的网页内容提取与 AI 中文摘要工具。用户输入网页链接后，系统会自动抓取网页正文，并调用 OpenAI-compatible API，例如 DeepSeek，生成中文摘要。

## 功能特性

- 输入网页 URL，一键生成摘要
- 自动提取网页正文内容
- 支持中文和英文网页
- 摘要结果统一使用中文展示
- 支持 DeepSeek / OpenAI-compatible API
- 二次元风格 UI
- 加载动画与友好错误提示
- 基础 URL 安全校验，避免访问本地和内网地址

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- jsdom
- @mozilla/readability
- cheerio
- openai SDK

## 项目结构

```text
interestproject/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── summarize/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AnimeBackground.tsx
│   │   ├── LoadingAnime.tsx
│   │   ├── SummaryResult.tsx
│   │   └── UrlInputCard.tsx
│   └── lib/
│       ├── extract.ts
│       ├── summarize.ts
│       └── validators.ts
├── .env.example
├── package.json
└── README.md
```

## 环境要求

建议使用：

- Node.js 18.18 或更高版本
- npm 9 或更高版本

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制示例文件：

```bash
copy .env.example .env.local
```

如果你使用 PowerShell，也可以执行：

```powershell
Copy-Item .env.example .env.local
```

然后编辑 `.env.local`。

使用 DeepSeek 时，推荐配置如下：

```text
OPENAI_API_KEY=你的_DeepSeek_API_Key
DEEPSEEK_API_KEY=你的_DeepSeek_API_Key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-chat
```

说明：

- `OPENAI_API_KEY`：兼容 OpenAI SDK 的 API Key 字段
- `DEEPSEEK_API_KEY`：DeepSeek Key 备用字段，项目会优先读取它
- `OPENAI_BASE_URL`：DeepSeek API 地址
- `OPENAI_MODEL`：摘要使用的模型，推荐 `deepseek-chat`

注意：

- 不要把真实 Key 写入 `.env.example`
- 不要把 `.env.local` 上传到 GitHub
- 修改 `.env.local` 后需要重启开发服务

### 3. 启动开发服务

```bash
npm run dev
```

打开浏览器访问：

```text
http://localhost:3000
```

如果 `3000` 端口被占用，Next.js 可能会自动使用 `3001`。

## 使用示例

在页面输入下面的网址：

```text
https://www.wenzizhan.com/article/22148.html
```

点击“生成摘要”后，工具会：

1. 抓取目标网页 HTML
2. 识别网页编码并解码内容
3. 提取文章标题和正文
4. 调用 DeepSeek 生成中文摘要
5. 在页面展示摘要结果

示例输出类似：

```text
母亲的咸菜是一篇情感文章，作者回忆了母亲腌制咸菜的手艺和童年时光。母亲用咸菜变换多种做法，让简单饭菜变得美味。后来作者离家求学工作，母亲的咸菜成为乡愁的象征，也承载着母亲朴素深沉的爱。
```

## 可用脚本

### 启动开发环境

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务

```bash
npm run start
```

### 代码检查

```bash
npm run lint
```

## API 说明

### 生成摘要

```http
POST /api/summarize
```

请求体：

```json
{
  "url": "https://example.com/article"
}
```

成功响应：

```json
{
  "title": "文章标题",
  "summary": "中文摘要内容",
  "sourceUrl": "https://example.com/article"
}
```

失败响应：

```json
{
  "error": "错误提示信息"
}
```

## 常见问题

### 1. 提示没有配置 API Key

请检查 `.env.local` 是否存在，并确认 Key 不为空：

```text
OPENAI_API_KEY=你的真实Key
DEEPSEEK_API_KEY=你的真实Key
```

保存后重启服务。

### 2. 页面可以打开，但生成摘要失败

可能原因：

- API Key 无效
- DeepSeek 账户余额不足
- 模型名配置错误
- 目标网页无法访问
- 目标网页内容需要登录或动态渲染

### 3. 某些网页无法提取正文

本项目主要支持普通 HTML 网页。以下网页可能无法稳定提取：

- 需要登录的网页
- 客户端动态渲染网页
- 有严格反爬限制的网页
- PDF、视频、图片类页面

## 发布到 GitHub

下面是将项目发布到 GitHub 的完整步骤。

### 1. 确认 `.gitignore`

确保 `.gitignore` 中包含：

```text
.env*.local
.next
node_modules
```

这样可以避免上传本地密钥、构建产物和依赖目录。

### 2. 初始化 Git 仓库

在项目根目录执行：

```bash
git init
```

### 3. 检查文件状态

```bash
git status
```

确认不会提交 `.env.local`。

### 4. 添加文件

```bash
git add .
```

### 5. 提交代码

```bash
git commit -m "feat: add AI web summary tool"
```

### 6. 在 GitHub 创建仓库

打开 GitHub：

```text
https://github.com/new
```

填写仓库信息，例如：

- Repository name: `interestproject`
- Visibility: Public 或 Private
- 不要勾选初始化 README，因为本项目已经有 README

创建后，GitHub 会给出远程仓库地址。

### 7. 关联远程仓库

将下面命令中的地址替换成你的 GitHub 仓库地址：

```bash
git remote add origin https://github.com/你的用户名/interestproject.git
```

### 8. 推送到 GitHub

如果默认分支是 `main`：

```bash
git branch -M main
git push -u origin main
```

如果你使用 SSH 地址，也可以这样：

```bash
git remote add origin git@github.com:你的用户名/interestproject.git
git branch -M main
git push -u origin main
```

## 部署建议

推荐部署到 Vercel。

### Vercel 部署步骤

1. 打开 Vercel

```text
https://vercel.com/new
```

2. 导入 GitHub 仓库
3. Framework Preset 选择 Next.js
4. 配置环境变量：

```text
OPENAI_API_KEY=你的真实Key
DEEPSEEK_API_KEY=你的真实Key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-chat
```

5. 点击 Deploy

部署完成后即可通过 Vercel 提供的域名访问。

## 安全说明

- API Key 只能放在服务端环境变量中
- 不要在前端代码中写入 API Key
- 不要把 `.env.local` 提交到 GitHub
- 如果 Key 曾经泄露，请立即到 DeepSeek 控制台删除并重新生成

## License

MIT
