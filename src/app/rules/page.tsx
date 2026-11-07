import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  HeartHandshake,
  Scale,
  ShieldCheck,
  Shuffle,
  Trophy,
} from 'lucide-react';
import {
  EA_OFFICIAL_DISCLAIMER_EN,
  ZSU_CHARITY_FUND_NAME,
  ZSU_MONOBANK_CARD,
  ZSU_MONOBANK_JAR_URL,
} from '@/lib/constants';
import { HoloCard } from '@/components/HoloCard';
import { MonoPrizeJarSvg, UaFlag } from '@/components/UaFlag';

export const dynamic = 'force-dynamic';

export default function RulesAndCompliancePage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 space-y-10 pb-6">
      {/* 1. HERO HEADER + MONOBANK ZSU JAR BENTO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 glass-panel rounded-[34px] p-7 sm:p-10 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full diia-iridescent-subtle border border-white/15 text-xs font-bold text-white">
              <UaFlag className="w-3.5 h-2.5" />
              <span>БУНКЕР • Регламент благодійного турніру 1v1</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.04em]">
              Правила турніру та{' '}
              <span className="diia-gradient-text">підтримка ЗСУ</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Наш турнір — це поєднання крутого футболу 1х1 в EA FC за системою{' '}
              <strong className="text-white">
                Ліги Чемпіонів (групи + плей-офф)
              </strong>{' '}
              та реальної допомоги армії. Усі 100% внесків зі спільної банки
              передаємо фонду{' '}
              <strong className="text-pitch">{ZSU_CHARITY_FUND_NAME}</strong>, а
              переможець отримує особливий трофей —{' '}
              <strong className="text-gold">
                пам’ятну нагороду від воїнів ЗСУ 🎖️
              </strong>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tournaments/november-cup-2026"
              className="px-6 py-3.5 rounded-full text-xs font-extrabold bg-white text-[#09090B] hover:bg-neutral-200 transition-all inline-flex items-center gap-2"
            >
              <span>Зареєструватися на турнір</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={ZSU_MONOBANK_JAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full text-xs font-extrabold bg-emerald-400/15 hover:bg-emerald-400/25 border border-emerald-400/35 text-pitch transition-colors inline-flex items-center gap-2"
            >
              <span>🫙 Відкрити Банку ЗСУ</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right: Official ZSU Monobank Jar Showcase */}
        <HoloCard
          variant="diia"
          className="lg:col-span-5 diia-card-surface rounded-[34px] p-7 sm:p-8 flex flex-col justify-between gap-6"
        >
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/15 text-xs font-bold text-white">
                <HeartHandshake className="w-3.5 h-3.5 text-pitch" />
                Спільна Банка ЗСУ • {ZSU_CHARITY_FUND_NAME}
              </span>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.04em] tabular-nums">
                від 10 <span className="diia-gradient-text">₴</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Тотального контролю по внесках немає — кожен кидає на банку ЗСУ
                скільки хоче і може 🇺🇦🙏. Квитанція про передачу 100% коштів
                публікується у нашій спільній Telegram-групі.
              </p>
            </div>

            <MonoPrizeJarSvg className="w-20 h-24 shrink-0" />
          </div>

          <div className="relative z-10 p-4 rounded-[22px] bg-black/45 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Картка Банки Моно</span>
              <span className="font-mono font-extrabold text-pitch tabular-nums">
                {ZSU_MONOBANK_CARD}
              </span>
            </div>
            <div className="flex items-center justify-between text-[0.7rem] text-slate-400 pt-1 border-t border-white/10">
              <span>Посилання на банку:</span>
              <a
                href={ZSU_MONOBANK_JAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sky-300 hover:underline inline-flex items-center gap-1"
              >
                <span>send.monobank.ua/jar/6aFeFX1Lk2</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </HoloCard>
      </section>

      {/* 2. 4 PILLARS OF THE CHARITY TOURNAMENT */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel rounded-[28px] p-6 space-y-2.5">
          <span className="px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/25 text-xs font-extrabold text-pitch">
            01 • Благодійний внесок
          </span>
          <h2 className="font-display text-lg font-extrabold text-white pt-1">
            Від 10 грн на Банку ЗСУ
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Кожен учасник донатить на спільну банку скільки хоче і може. Усі
            100% зібраних коштів передаємо фонду {ZSU_CHARITY_FUND_NAME}.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] p-6 space-y-2.5">
          <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/25 text-xs font-extrabold text-gold">
            02 • Головний приз
          </span>
          <h2 className="font-display text-lg font-extrabold text-white pt-1">
            🎖️ Нагорода від воїнів ЗСУ
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Переможець турніру отримує особливий пам’ятний сувенір/нагороду від
            українських захисників та очки в рейтинг сезону.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] p-6 space-y-2.5">
          <span className="px-3 py-1 rounded-full bg-sky-400/15 border border-sky-400/25 text-xs font-extrabold text-sky-300">
            03 • Вільний графік
          </span>
          <h2 className="font-display text-lg font-extrabold text-white pt-1">
            Домовленість у Telegram
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Жодних жорстких годин: про час та дату матчів гравці домовляються
            між собою напряму в Telegram (бажано зіграти групу за тиждень).
          </p>
        </div>

        <div className="glass-panel rounded-[28px] p-6 space-y-2.5">
          <span className="px-3 py-1 rounded-full bg-white/[0.07] border border-white/15 text-xs font-extrabold text-white">
            04 • Чесні правила EA
          </span>
          <h2 className="font-display text-lg font-extrabold text-white pt-1">
            Повна відповідність
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Власна геральдика клубів, прозора автоматична сітка та офіційний
            дисклеймер спільноти: «{EA_OFFICIAL_DISCLAIMER_EN}».
          </p>
        </div>
      </section>

      {/* 3. SPORTS FORMAT & VAR ARBITRATION BENTO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-[32px] p-7 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-white font-display text-xl font-extrabold">
            <Shuffle className="w-5 h-5 text-sky-300" />
            <h2>Формат Ліги Чемпіонів: Групи та Плей-офф</h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-200">
            <div className="p-4 rounded-2xl bg-[#10121A]/60 border border-white/[0.12] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-pitch shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Автоматичне жеребкування на сайті
                </strong>
                Після набору 16 гравців на платформі автоматично проводиться
                жеребкування на 4 групи (A, B, C, D) та за бажанням — драфт
                рівних клубів.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#10121A]/60 border border-white/[0.12] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-pitch shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Груповий етап (бажано зіграти за тиждень)
                </strong>
                У кожній групі по 4 учасники. За перемогу нараховується 3 очки,
                за нічию — 1 очко. ТОП-2 кожної групи виходять у стадію Плей-офф.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#10121A]/60 border border-white/[0.12] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-pitch shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Крос-сітка Плей-офф на виліт
                </strong>
                Переможці груп грають проти других місць інших груп (A1–C2,
                D1–B2), щоб одногрупники не зустрілися раніше Фіналу.
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-7 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-white font-display text-xl font-extrabold">
            <Scale className="w-5 h-5 text-gold" />
            <h2>Матч 1v1, Telegram-комунікація та VAR</h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-200">
            <div className="p-4 rounded-2xl bg-[#10121A]/60 border border-white/[0.12] flex items-start gap-3">
              <Trophy className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Налаштування лобі EA SPORTS FC
                </strong>
                Режим Online Friendlies (Cross-Play PS5 / PC / Xbox), тайм — 6
                хвилин, швидкість — Normal, склади — Online або рівні 95 OVR.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#10121A]/60 border border-white/[0.12] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-pitch shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Внесення рахунку та авто-таблиці
                </strong>
                Гравці списуються у Telegram в 1 клік з картки матчу, грають гру
                та вносять рахунок зі скріншотом — таблиця групи оновлюється
                миттєво.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#10121A]/60 border border-[#FF5C39]/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF7A5C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Дисконнекти та виклик організатора (VAR)
                </strong>
                При розриві з&apos;єднання доігруються хвилини, що залишилися, зі
                збереженням рахунку. У разі спірної ситуації кнопка «Викликати
                VAR-Суддю» передає матч організатору.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
