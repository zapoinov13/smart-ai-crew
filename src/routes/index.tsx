import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import yuriAsset from "@/assets/yuri.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const WHATSAPP_URL = "https://chat.whatsapp.com/JqhTdCL3koe9CaGXaCqj4e?mode=gi_t";

// Countdown target: 24h from first mount, persisted in localStorage
const DEADLINE_KEY = "promo_deadline_v1";
function getDeadline() {
  if (typeof window === "undefined") return Date.now() + 24 * 3600 * 1000;
  const stored = window.localStorage.getItem(DEADLINE_KEY);
  if (stored) {
    const n = Number(stored);
    if (n > Date.now()) return n;
  }
  const next = Date.now() + 24 * 3600 * 1000;
  window.localStorage.setItem(DEADLINE_KEY, String(next));
  return next;
}

function Index() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    setDeadline(getDeadline());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = useMemo(() => {
    const ms = Math.max(0, (deadline ?? now) - now);
    const s = Math.floor(ms / 1000);
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return { h, m, s: sec };
  }, [deadline, now]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 10) return;
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-hero-radial font-sans text-white antialiased">
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 75%)",
        }}
      />
      {/* Noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-5 pt-5 pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 backdrop-blur">
              <span className="font-display text-[13px] font-extrabold text-gradient-indigo">AI</span>
            </div>
            <span className="font-display text-[13px] font-bold tracking-wide text-white/90">
              Marketing Lab
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
              Live
            </span>
          </div>
        </div>

        {/* Kicker */}
        <div className="mt-7 flex justify-center gap-1.5">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur">
            Бесплатно
          </span>
          <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-indigo-200 backdrop-blur">
            Онлайн Zoom
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-4 text-center font-sans text-[32px] font-extrabold leading-[1.02] tracking-tight text-white">
          Создай своё первое
          <br />
          <span className="whitespace-nowrap"><span className="text-gradient-indigo">приложение</span> за вечер</span>
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
            Пока другие используют нейросети для{" "}
            <span className="text-black/45">текста и картинок</span>, ты научишься создавать{" "}
            <mark className="rounded bg-[#E8FF3A] px-1 font-bold text-black">сайты и приложения</mark>
            , за которые{" "}
            <span className="font-extrabold text-black">бизнес готов платить</span>.
          </p>
        </div>

        {/* Portrait */}
        <div className="relative mx-auto mt-6 w-[240px]">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(124,116,255,0.55),transparent_65%)] blur-2xl animate-pulse-ring"
          />
          <div className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10 ring-glow">
            <img
              src={yuriAsset.url}
              alt="Юрий — создатель AI Marketing Lab"
              className="h-auto w-full object-contain"
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

        {/* Value bullets */}
        <ul className="mt-7 grid grid-cols-2 gap-2 text-[11.5px] leading-tight">
          {[
            ["Сайты", "за 5 минут"],
            ["Приложения", "без\u00a0 знаний кода"],
            ["AI-сервисы", "под ключ для бизнеса"],
            ["Продажи", "от $1 000"],
          ].map(([title, sub]) => (
            <li
              key={title}
              className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-3 py-2 backdrop-blur"
            >
              <div className="flex items-center gap-1.5">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-500/20 text-[9px] text-indigo-300">
                  ✓
                </span>
                <span className="font-semibold text-white">{title}</span>
              </div>
              <div className="mt-0.5 pl-5 text-[10.5px] text-white/50">{sub}</div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative mt-6 flex items-center justify-between overflow-hidden rounded-full bg-[#1E3AFF] pl-7 pr-2 py-2.5 text-left animate-cta-pulse transition-transform active:scale-[0.99]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -inset-x-1/4 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"
          />
          <span className="relative font-display text-[18px] font-extrabold leading-none text-white">
            Занять место бесплатно
          </span>
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E8FF3A]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#1E3AFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
        </button>

        {/* Scarcity */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
          </span>
          Осталось <span className="font-display font-extrabold text-white">7&nbsp;мест</span> из 50
        </div>

        {/* Price row */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="font-display text-[18px] font-bold text-white/40 line-through decoration-white/40">
            $150
          </span>
          <span className="font-display text-[26px] font-extrabold text-white">$0</span>
          <span className="rounded-full bg-emerald-400/90 px-3.5 py-1.5 font-display text-[13px] font-bold text-[#04120a]">
            Сейчас бесплатно
          </span>
        </div>

        {/* Timer */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/50">
            <span>{"\n"}</span>
            <span className="text-indigo-300">{"\n"}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              ["часы", time.h],
              ["минуты", time.m],
              ["секунды", time.s],
            ].map(([label, val]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] py-2 text-center"
              >
                <div className="font-display text-[22px] font-extrabold tabular-nums text-white">
                  {val}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {["#7c74ff", "#4f46e5", "#a5a0ff", "#6366f1"].map((c, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-full ring-2 ring-[#05050d]"
                style={{ background: `linear-gradient(135deg, ${c}, #1e1e5a)` }}
              />
            ))}
          </div>
          <div className="text-[10.5px] leading-tight text-white/60">
            {"\n"}
          </div>
        </div>

        {/* Marquee */}
        <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-2">
            {Array.from({ length: 2 }).flatMap((_, r) =>
              [
                "No-code",
                "AI Automation",
                "Lovable",
                "Supabase",
                "n8n",
                "GPT-5",
                "Zapier",
                "Make",
                "Stripe",
                "Webflow",
              ].map((t, i) => (
                <span
                  key={`${r}-${i}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-widest text-white/60"
                >
                  {t}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#05050d]/80 p-4 backdrop-blur-md sm:items-center" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-[#141432] to-[#0a0a1a] p-6 text-white ring-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-xl font-extrabold leading-tight">
                Заполните форму для получения доступа
              </h2>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/15"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Имя</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  placeholder="Ваше имя"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none focus:border-indigo-400 focus:bg-white/10"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Номер телефона</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  placeholder="+7 (___) ___-__-__"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none focus:border-indigo-400 focus:bg-white/10"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 font-display text-[16px] font-extrabold text-white btn-glow active:scale-[0.98]"
              >
                Участвовать бесплатно
              </button>
              <p className="text-center text-[10px] text-white/40">
                Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
