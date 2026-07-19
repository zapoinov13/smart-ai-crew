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
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pt-6 pb-6">
        {/* Headline */}
        <h1 className="text-center text-[32px] font-black leading-[1.05] tracking-tight sm:text-4xl">
          Перестань продавать <span className="text-blue-600">своё время</span>
        </h1>
        <p className="mt-3 text-center text-[13px] leading-tight text-neutral-700">
          Бесплатный онлайн-практикум для таргетологов.
          <br />
          Как построить&nbsp;<span className="font-semibold">AI-команду</span>, которая работает вместо тебя.
        </p>

        {/* Bullets */}
        <ul className="mt-3 space-y-1 text-[13px] leading-tight text-neutral-800">
          <li className="flex gap-2"><span className="text-blue-600">✔</span> как работает мой контент завод</li>
          <li className="flex gap-2"><span className="text-blue-600">✔</span> как запускается реклама в 2 клика</li>
          <li className="flex gap-2"><span className="text-blue-600">✔</span> как автоматически собираются отчёты</li>
          <li className="flex gap-2"><span className="text-blue-600">✔</span> как строятся сайты за 5 минут</li>
        </ul>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            ["С нуля", "🚀"],
            ["Без опыта", "📈"],
            ["Онлайн", "💻"],
          ].map(([t, e]) => (
            <span key={t} className="rounded-full bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-neutral-800">
              {t} <span className="ml-0.5">{e}</span>
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-neutral-800">
            Без программирования ⚙️
          </span>
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-neutral-800">
            Практика в Zoom 🎥
          </span>
        </div>

        {/* Photo with floating cards */}
        <div className="relative mx-auto mt-4 w-full max-w-sm">
          <div className="relative mx-auto h-[320px] w-[78%]">
            <img
              src={yuriAsset.url}
              alt="Юрий — создатель MarkVision AI"
              className="h-full w-full rounded-3xl object-cover object-center"
            />
          </div>

          {/* Left floating card */}
          <div className="absolute -left-1 -top-2 w-[38%] rotate-[-6deg] rounded-2xl bg-white p-2.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-1.5">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-yellow-400 text-[11px] font-black text-black">T</span>
              <span className="text-[11px] font-bold">Т-Банк</span>
            </div>
            <div className="mt-1 text-[14px] font-black">₸150 000</div>
            <div className="text-[9px] text-neutral-500">Айдар М.</div>
          </div>

          {/* Right floating card */}
          <div className="absolute -right-1 -top-2 w-[38%] rotate-[6deg] rounded-2xl bg-white p-2.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-1.5">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-green-500 text-[10px] font-black text-white">C</span>
              <span className="text-[11px] font-bold">Сбербанк</span>
            </div>
            <div className="text-[9px] text-neutral-500">Пополнение</div>
            <div className="mt-0.5 text-[14px] font-black text-green-600">25 000 ₽</div>
          </div>

          {/* Notification card — below photo, doesn't cover face */}
          <div className="mx-auto mt-3 max-w-[92%] rounded-2xl bg-white p-3 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
            <div className="flex items-start gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-[13px] font-black text-white">AI</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[12px] font-bold">AI Marketing Lab</span>
                  <span className="text-[10px] text-neutral-400">сейчас</span>
                </div>
                <div className="text-[12px] leading-tight">
                  Эфир <span className="font-bold text-green-600">1 августа, 20:00</span>
                </div>
                <div className="text-[10px] text-neutral-500">Zoom · 90 минут</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 flex items-center justify-center gap-3 rounded-full bg-blue-600 px-6 py-4 text-[17px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] transition-transform active:scale-[0.98]"
        >
          Забронировать место
          <span className="grid h-7 w-7 place-items-center rounded-full bg-yellow-300 text-black">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </button>

        {/* Timer */}
        <div className="mt-4 rounded-2xl bg-neutral-900 px-4 py-3 text-center text-white">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400">
            До конца акции
          </div>
          <div className="mt-1 flex items-center justify-center gap-2 font-mono text-2xl font-black tabular-nums">
            <span className="rounded-lg bg-white/10 px-2 py-1">{time.h}</span>
            <span className="text-neutral-500">:</span>
            <span className="rounded-lg bg-white/10 px-2 py-1">{time.m}</span>
            <span className="text-neutral-500">:</span>
            <span className="rounded-lg bg-white/10 px-2 py-1">{time.s}</span>
          </div>
          <div className="mt-1 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-neutral-400">
            <span>часы</span><span>мин</span><span>сек</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-black leading-tight">
                Заполните форму для получения доступа
              </h2>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div>
                <label className="text-[12px] font-semibold text-neutral-700">Имя</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  placeholder="Ваше имя"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-neutral-700">Номер телефона</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  placeholder="+7 (___) ___-__-__"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-blue-600 px-6 py-4 text-[16px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] active:scale-[0.98]"
              >
                Участвовать бесплатно
              </button>
              <p className="text-center text-[10px] text-neutral-400">
                Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
