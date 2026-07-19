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

      <div className="relative mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-5 pt-5 pb-6">
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
              Live · 1 авг
            </span>
          </div>
        </div>

        {/* Kicker */}
        <div className="mt-6 flex justify-center">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur">
            Бесплатный практикум · Zoom
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-4 text-center font-display text-[38px] font-extrabold leading-[0.95] tracking-tight">
          Перестань
          <br />
          продавать
          <br />
          <span className="text-gradient-indigo">своё&nbsp;время</span>
        </h1>

        <p className="mx-auto mt-3 max-w-[320px] text-center text-[13px] leading-snug text-white/60">
          Как построить <span className="font-semibold text-white/90">AI‑команду</span>, которая
          работает вместо тебя — за&nbsp;2 часа в прямом эфире.
        </p>

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
              className="h-[260px] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05050d] via-[#05050d]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
              <span className="font-display text-[13px] font-bold text-white">Юрий Марков</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Founder · AI Marketing Lab
              </span>
            </div>
          </div>

          {/* Floating stat left */}
          <div className="absolute -left-6 top-6 rotate-[-6deg] rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-xl ring-glow">
            <div className="text-[9px] uppercase tracking-widest text-white/50">Автоматизация</div>
            <div className="font-display text-[16px] font-extrabold text-white">92%</div>
          </div>
          {/* Floating stat right */}
          <div className="absolute -right-6 bottom-16 rotate-[6deg] rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-xl ring-glow">
            <div className="text-[9px] uppercase tracking-widest text-white/50">Экономия</div>
            <div className="font-display text-[16px] font-extrabold text-emerald-300">−40ч/нед</div>
          </div>
        </div>

        {/* Value bullets */}
        <ul className="mt-6 grid grid-cols-2 gap-2 text-[11.5px] leading-tight">
          {[
            ["Контент завод", "на автопилоте"],
            ["Реклама", "в 2 клика"],
            ["Отчёты", "собираются сами"],
            ["Сайты", "за 5 минут"],
          ].map(([title, sub]) => (
            <li
              key={title}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 backdrop-blur"
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
          className="group relative mt-6 flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-violet-500 px-5 py-4 text-left btn-glow transition-transform active:scale-[0.99]"
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
          <span className="relative">
            <span className="block font-display text-[17px] font-extrabold leading-none text-white">
              Забронировать место
            </span>
            <span className="mt-1 block text-[10.5px] uppercase tracking-[0.2em] text-white/70">
              Осталось 37 мест
            </span>
          </span>
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
              <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z" />
            </svg>
          </span>
        </button>

        {/* Timer */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/50">
            <span>До конца регистрации</span>
            <span className="text-indigo-300">−50% бонусов</span>
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
