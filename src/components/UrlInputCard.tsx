type UrlInputCardProps = {
  url: string;
  loading: boolean;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
};

export function UrlInputCard({ url, loading, onUrlChange, onSubmit }: UrlInputCardProps) {
  return (
    <section className="w-full rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-2xl shadow-pink-200/50 backdrop-blur-2xl sm:p-8">
      <div className="mb-6 text-center">
        <p className="mb-3 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-pink-500 shadow-sm">
          Web Summary Assistant
        </p>
        <h1 className="text-4xl font-black tracking-tight text-violet-900 sm:text-6xl">
          小白信息提取
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          输入一个网页链接，让 AI 自动提取正文并用中文生成简洁摘要。支持中文和英文网页。
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-pink-100 bg-white/75 p-3 shadow-inner sm:flex-row">
        <input
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !loading) onSubmit();
          }}
          placeholder="粘贴网页地址，例如 https://example.com/article"
          className="min-h-14 flex-1 rounded-2xl border border-transparent bg-white/85 px-5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-200/70"
          disabled={loading}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="min-h-14 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-7 font-black text-white shadow-lg shadow-pink-300/60 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "提取中..." : "生成摘要"}
        </button>
      </div>
    </section>
  );
}
