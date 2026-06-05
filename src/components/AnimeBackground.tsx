type AnimeBackgroundProps = {
  children: React.ReactNode;
};

const sparkles = [
  "left-[8%] top-[16%] h-3 w-3 animate-[twinkle_2.4s_ease-in-out_infinite]",
  "right-[12%] top-[18%] h-2 w-2 animate-[twinkle_2s_ease-in-out_infinite_0.4s]",
  "left-[18%] bottom-[18%] h-2.5 w-2.5 animate-[twinkle_2.8s_ease-in-out_infinite_0.8s]",
  "right-[22%] bottom-[25%] h-3 w-3 animate-[twinkle_2.2s_ease-in-out_infinite_1s]",
  "left-[48%] top-[10%] h-2 w-2 animate-[twinkle_2.6s_ease-in-out_infinite_0.2s]",
];

export function AnimeBackground({ children }: AnimeBackgroundProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#fff7ad_0,#ffd7ef_24%,#d9e7ff_56%,#f9f4ff_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-pink-300/40 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="absolute right-[16%] top-[24%] h-28 w-28 rounded-full bg-sky-200/40 blur-2xl" />

      {sparkles.map((className, index) => (
        <span
          key={index}
          className={`absolute rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.95)] ${className}`}
        />
      ))}

      <div className="absolute left-[6%] top-[44%] hidden rotate-[-10deg] rounded-[2rem] border border-white/60 bg-white/25 px-5 py-3 text-sm font-bold text-pink-500 shadow-xl backdrop-blur md:block">
        URL Magic
      </div>
      <div className="absolute bottom-[12%] right-[8%] hidden rotate-[8deg] rounded-full border border-white/70 bg-white/35 px-5 py-3 text-sm font-bold text-violet-500 shadow-xl backdrop-blur md:block">
        Summary Power
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center">
        {children}
      </div>
    </main>
  );
}
