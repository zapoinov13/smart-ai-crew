import { createFileRoute } from "@tanstack/react-router";
import yuriAsset from "@/assets/yuri.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const WHATSAPP_URL = "https://chat.whatsapp.com/JqhTdCL3koe9CaGXaCqj4e?mode=gi_t";

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pt-6 pb-6">
        {/* Headline */}
        <h1 className="text-center text-[32px] font-black leading-[1.05] tracking-tight sm:text-4xl">
          Построй свою{" "}
          <span className="text-blue-600">AI команду</span>{" "}
          и перестань продавать своё время
        </h1>
        <p className="mt-3 text-center text-[13px] leading-tight text-neutral-700 whitespace-pre-line">
          За <span className="font-semibold">90 минут</span> покажу систему, которая делает{"\u00a0"}{"\n"}
          контент завод, рекламу, сайты и CRM за тебя
        </p>

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
        <div className="relative mx-auto mt-4 flex-1 w-full max-w-sm">
          <div className="relative mx-auto h-full min-h-[280px] w-[75%]">
            <img
              src={yuriAsset.url}
              alt="Юрий — создатель MarkVision AI"
              className="absolute inset-x-0 bottom-0 mx-auto h-full w-full rounded-3xl object-cover object-top"
            />
          </div>

          {/* Left floating card */}
          <div className="absolute left-0 top-4 w-[40%] rotate-[-6deg] rounded-2xl bg-white p-3 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-1.5">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-yellow-400 text-[11px] font-black text-black">T</span>
              <span className="text-[11px] font-bold">Т-Банк</span>
            </div>
            <div className="mt-1.5 text-[15px] font-black">₸150 000</div>
            <div className="text-[9px] text-neutral-500">Айдар М.</div>
          </div>

          {/* Right floating card */}
          <div className="absolute right-0 top-4 w-[40%] rotate-[6deg] rounded-2xl bg-white p-3 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-1.5">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-green-500 text-[10px] font-black text-white">C</span>
              <span className="text-[11px] font-bold">Сбербанк</span>
            </div>
            <div className="text-[9px] text-neutral-500">Пополнение</div>
            <div className="mt-0.5 text-[15px] font-black text-green-600">25 000 ₽</div>
          </div>

          {/* Notification card */}
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-2xl bg-white p-3 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.22)]">
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
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-3 rounded-full bg-blue-600 px-6 py-4 text-[17px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] transition-transform active:scale-[0.98]"
        >
          Занять место бесплатно
          <span className="grid h-7 w-7 place-items-center rounded-full bg-yellow-300 text-black">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </a>

        <div className="mt-3 flex items-center justify-center gap-3 text-[13px]">
          <span className="text-neutral-400 line-through">$150</span>
          <span className="text-lg font-black">$0</span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
            Сейчас бесплатно
          </span>
        </div>
      </div>
    </main>
  );
}
