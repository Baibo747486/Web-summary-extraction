export function LoadingAnime() {
  return (
    <div className="mt-6 rounded-3xl border border-white/70 bg-white/55 p-6 text-center shadow-xl backdrop-blur-xl">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 via-fuchsia-300 to-sky-300 shadow-[0_0_40px_rgba(236,72,153,0.45)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/60 border-t-white" />
      </div>
      <p className="text-base font-bold text-violet-700">AI 摘要酱正在努力阅读网页中...</p>
      <div className="mt-3 flex justify-center gap-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-pink-400" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:240ms]" />
      </div>
    </div>
  );
}
