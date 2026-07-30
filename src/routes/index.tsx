import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import yuriPhoto from "@/assets/yuri.webp";
import { initLandingPixel, openWhatsAppAccess } from "@/lib/wa-redirect";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    initLandingPixel();
  }, []);

  const onCta = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await openWhatsAppAccess();
    } finally {
      window.setTimeout(() => setBusy(false), 1500);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-hero-radial font-sans text-white antialiased">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-5 pt-5 pb-8">
        <div className="relative flex items-start justify-end pt-1">
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
              Live
            </span>
          </div>
        </div>

        <div className="mt-7 flex justify-center gap-1.5">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Бесплатно
          </span>
          <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
            Онлайн Zoom
          </span>
        </div>

        <h1 className="mt-4 text-center font-sans text-[32px] font-extrabold leading-[1.02] tracking-tight text-white">
          Создай своё первое
          <br />
          <span className="whitespace-nowrap">
            <span className="text-gradient-indigo">приложение</span> за вечер
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-[340px] whitespace-pre-line text-center font-sans text-[16px] font-semibold leading-snug text-white">
          И узнай, как продавать такие{"\n"}решения бизнесу{" "}
          <span className="whitespace-nowrap rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-indigo-200 ring-1 ring-indigo-400/30">
            от&nbsp;$1&nbsp;000
          </span>
        </p>

        <div className="mx-auto mt-5 flex max-w-[340px] flex-wrap justify-center gap-1.5">
          {[
            ["С нуля", "🚀"],
            ["Без опыта", "📈"],
            ["На удалёнке", "💻"],
          ].map(([label, icon]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-[#1E3AFF] shadow-[0_6px_20px_-10px_rgba(30,58,255,0.6)] ring-1 ring-white/40"
            >
              {label}
              <span className="text-[13px] leading-none">{icon}</span>
            </span>
          ))}
        </div>

        <div className="mx-auto mt-4 max-w-[330px] rounded-2xl bg-white px-4 py-3 text-center shadow-[0_10px_40px_-15px_rgba(124,116,255,0.6)] ring-1 ring-black/5">
          <p className="font-sans text-[12.5px] leading-snug text-black/80">
            Пока другие используют нейросети для текста и картинок, ты начнешь создавать{" "}
            <span className="font-semibold text-[#7C74FF]">сайты и приложения</span>
            , за которые{" "}
            <span className="font-extrabold text-black">готовы платить</span>.
          </p>
        </div>

        <div className="relative mx-auto mt-6 w-[240px]">
          <div className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10">
            <img
              src={yuriPhoto}
              alt="Юрий — создатель AI Marketing Lab"
              width={480}
              height={720}
              decoding="async"
              fetchPriority="high"
              className="h-auto w-full object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05050d] via-[#05050d]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
              <span className="font-display text-[13px] font-bold text-white">Юрий Валерьевич</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                FOUNDER · MARKVISION AI
              </span>
            </div>
          </div>
        </div>

        <ul className="mt-7 grid grid-cols-2 gap-2 text-[11.5px] leading-tight">
          {[
            ["Сайты", "за 5 минут"],
            ["Приложения", "без\u00a0 знаний кода"],
            ["AI таргетолог", ""],
            ["контент завод", ""],
          ].map(([title, sub]) => (
            <li
              key={title}
              className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-3 py-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-500/20 text-[9px] text-indigo-300">
                  ✓
                </span>
                <span className="font-semibold text-white">{title}</span>
              </div>
              {sub ? (
                <div className="mt-0.5 pl-5 text-[10.5px] text-white/50">{sub}</div>
              ) : null}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onCta}
          disabled={busy}
          className="group relative mt-6 flex items-center justify-between overflow-hidden rounded-full bg-[#1E3AFF] pl-7 pr-2 py-2.5 text-left shadow-[0_16px_40px_-12px_rgba(30,58,255,0.75)] transition-transform active:scale-[0.99] disabled:opacity-80"
        >
          <span className="relative font-display text-[18px] font-extrabold leading-none text-white">
            {busy ? "Открываю WhatsApp…" : "Занять место бесплатно"}
          </span>
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E8FF3A]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="#1E3AFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
        </button>

        <div className="mt-3 flex items-center justify-center gap-2 whitespace-pre-line text-center text-[11px] text-white/70">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          Осталось{"\n"}
          <span className="font-display font-extrabold text-white">7&nbsp;мест</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="font-display text-[18px] font-bold text-white/40 line-through decoration-white/40">
            $150
          </span>
          <span className="font-display text-[26px] font-extrabold text-white">$0</span>
          <span className="rounded-full bg-emerald-400/90 px-3.5 py-1.5 font-display text-[13px] font-bold text-[#04120a]">
            Сейчас бесплатно
          </span>
        </div>
      </div>
    </main>
  );
}
