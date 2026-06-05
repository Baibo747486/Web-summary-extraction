export type SummaryData = {
  title: string;
  summary: string;
  sourceUrl: string;
};

type SummaryResultProps = {
  result: SummaryData;
};

export function SummaryResult({ result }: SummaryResultProps) {
  return (
    <section className="mt-6 w-full rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-2xl shadow-violet-200/40 backdrop-blur-2xl sm:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.25em] text-pink-500">中文摘要</p>
          <h2 className="text-2xl font-black leading-tight text-violet-950">{result.title}</h2>
        </div>
        <a
          href={result.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
        >
          查看原文
        </a>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-white/90 to-pink-50/80 p-5 text-base leading-8 text-slate-700 shadow-inner whitespace-pre-wrap">
        {result.summary}
      </div>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(result.summary)}
        className="mt-5 rounded-full bg-violet-100 px-5 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-200"
      >
        复制摘要
      </button>
    </section>
  );
}
