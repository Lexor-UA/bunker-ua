import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 space-y-10 pb-10">
      {/* 1. HERO HEADER + MONOBANK ZSU JAR BENTO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 glass-panel rounded-[34px] border border-sky-400/25 p-7 sm:p-10 flex flex-col justify-between gap-6 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[3px] diia-iridescent-bg"
          />
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#07112E]/90 border border-amber-400/35 text-xs font-extrabold text-white">
              <UaFlag className="w-4 h-3" />
              <span className="uppercase tracking-wider">
                BUNKER FC 1V1 • UKRAINE • ОФІЦІЙНИЙ РЕГЛАМЕНТ 2026/27
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.035em] uppercase">
              Правила турніру та{' '}
              <span className="diia-gradient-text">підтримка ЗСУ</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200/95 leading-relaxed max-w-2xl">
              Платформа поєднує змагальний кіберфутбол 1v1 в EA SPORTS FC за
              системою{' '}
              <strong className="text-white">
                Ліги Чемпіонів (групи у 2 кола + сітка Плей-офф)
              </strong>
              , інтелектуальну систему <strong className="text-sky-300">BUNKER AI Telemetry & VAR</strong>{' '}
              та реальну допомогу армії. Усі 100% внесків передаємо фонду{' '}
              <strong className="text-sky-300">{ZSU_CHARITY_FUND_NAME}</strong>,
              а переможець отримує ексклюзивний приз —{' '}
              <strong className="text-gold">
                пам’ятний трофей від воїнів ЗСУ
              </strong>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tournaments/november-cup-2026"
              className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 transition-all shadow-[0_12px_30px_rgba(245,196,81,0.35)] inline-flex items-center gap-2"
            >
              <span>Подати заявку на Турнір #2</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={ZSU_MONOBANK_JAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold bg-[#060E24]/90 hover:bg-amber-400/15 border border-amber-400/35 text-gold transition-colors inline-flex items-center gap-2"
            >
              <UaFlag className="w-3.5 h-2.5 shrink-0" />
              <span>Відкрити Банку ЗСУ</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right: Official ZSU Monobank Jar Showcase */}
        <HoloCard
          variant="diia"
          className="lg:col-span-5 diia-card-surface rounded-[34px] border border-gold/30 p-7 sm:p-8 flex flex-col justify-between gap-6"
        >
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#040A18]/90 border border-gold/35 text-xs font-bold text-amber-200">
                <HeartHandshake className="w-3.5 h-3.5 text-gold" />
                <span>Спільна Банка ЗСУ • {ZSU_CHARITY_FUND_NAME}</span>
                <UaFlag className="w-3.5 h-2.5" />
              </span>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.035em] tabular-nums">
                від 10 <span className="text-gold">₴</span>
              </div>
              <p className="text-xs text-slate-200/95 leading-relaxed">
                Фіксованого обмеження по внесках немає — кожен учасник донатить
                на Спільну Банку ЗСУ скільки хоче і може. Офіційна квитанція про
                передачу 100% коштів публікується у нашій Telegram-спільноті.
              </p>
            </div>

            <MonoPrizeJarSvg className="w-20 h-24 shrink-0" />
          </div>

          <div className="relative z-10 p-4 rounded-[22px] bg-[#040A18]/85 border border-sky-400/25 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Картка Спільної Банки ЗСУ</span>
              <span className="font-mono font-extrabold text-gold tabular-nums">
                {ZSU_MONOBANK_CARD}
              </span>
            </div>
            <div className="flex items-center justify-between text-[0.7rem] text-slate-400 pt-1.5 border-t border-white/10">
              <span>Офіційне посилання Monobank:</span>
              <a
                href={ZSU_MONOBANK_JAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sky-300 hover:text-gold inline-flex items-center gap-1 transition-colors"
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
        <div className="glass-panel rounded-[28px] border border-sky-400/20 p-6 space-y-2.5">
          <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/35 text-xs font-mono font-extrabold text-gold">
            01 • БЛАГОДІЙНИЙ ВНЕСОК
          </span>
          <h2 className="font-display text-lg font-extrabold text-white pt-1">
            Від 10 ₴ на Банку ЗСУ
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Кожен учасник донатить на Спільну Банку скільки хоче і може. Усі
            100% зібраних коштів передаємо фонду {ZSU_CHARITY_FUND_NAME}.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] border border-sky-400/20 p-6 space-y-2.5">
          <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/35 text-xs font-mono font-extrabold text-gold">
            02 • ГОЛОВНИЙ ПРИЗ
          </span>
          <h2 className="font-display text-lg font-extrabold text-white pt-1">
            Трофей від воїнів ЗСУ
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Переможець турніру отримує ексклюзивний пам’ятний трофей від
            українських захисників, золотий бейдж та очки в рейтинг сезону.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] border border-sky-400/20 p-6 space-y-2.5">
          <span className="px-3 py-1 rounded-full bg-sky-400/15 border border-sky-400/35 text-xs font-mono font-extrabold text-sky-300">
            03 • ВІЛЬНИЙ ГРАФІК
          </span>
          <h2 className="font-display text-lg font-extrabold text-white pt-1">
            Домовленість у Telegram
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Жодних жорстких годин: про час та дату матчів гравці домовляються
            між собою напряму в Telegram (бажано зіграти групу за тиждень).
          </p>
        </div>

        <div className="glass-panel rounded-[28px] border border-sky-400/20 p-6 space-y-2.5">
          <span className="px-3 py-1 rounded-full bg-sky-400/15 border border-sky-400/35 text-xs font-mono font-extrabold text-sky-300">
            04 • AI TELEMETRY & VAR
          </span>
          <h2 className="font-display text-lg font-extrabold text-white pt-1">
            Інтелектуальний контроль
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Автоматичний розрахунок FUT OVR, xG-моделювання матчів BO3,
            верифікація скріншотів рахунку та відповідність стандартам EA.
          </p>
        </div>
      </section>

      {/* 3. SPORTS FORMAT & AI VAR ARBITRATION BENTO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-[32px] border border-sky-400/25 p-7 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-white font-display text-xl font-extrabold">
            <Shuffle className="w-5 h-5 text-sky-300" />
            <h2>Формат Ліги Чемпіонів: Групи та Плей-офф</h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-200">
            <div className="p-4 rounded-2xl bg-[#040A1C]/80 border border-sky-400/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Автоматичне жеребкування та посів на сайті
                </strong>
                Після завершення реєстрації платформа автоматично формує групи
                за рейтингом (матчі у 2 кола — вдома та на виїзді) та генерує
                розклад поєдинків.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A1C]/80 border border-sky-400/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Груповий етап (бажано зіграти за тиждень)
                </strong>
                За перемогу нараховується 3 очки, за нічию — 1 очко. Найкращі
                гравці груп виходять в олімпійську сітку Плей-офф (1/4 фіналу,
                Півфінали та Гранд-Фінал).
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A1C]/80 border border-sky-400/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Крос-сітка Плей-офф на виліт (BO3)
                </strong>
                Переможці груп грають проти других місць інших груп, щоб
                одногрупники не зустрілися раніше вирішальних стадій кубка.
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] border border-sky-400/25 p-7 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-white font-display text-xl font-extrabold">
            <Cpu className="w-5 h-5 text-gold" />
            <h2>Матч 1v1, AI-Телеметрія та VAR-Арбітраж</h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-200">
            <div className="p-4 rounded-2xl bg-[#040A1C]/80 border border-sky-400/20 flex items-start gap-3">
              <Trophy className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Налаштування лобі EA SPORTS FC
                </strong>
                Режим Online Friendlies / Ultimate Team 1v1 (Cross-Play PS5 /
                PC / Xbox), тайм — 6 хвилин, швидкість — Normal.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A1C]/80 border border-sky-400/20 flex items-start gap-3">
              <Bot className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Внесення рахунку, скріншот-протокол та AI-рейтинг
                </strong>
                Гравці зв’язуються в Telegram в 1 клік з Кімнати матчу, грають
                поєдинок та вносять рахунок зі скріншотом — таблиця групи, сітка
                Плей-офф та FUT OVR оновлюються миттєво.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040A1C]/80 border border-[#FF5C39]/35 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF7A5C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Дисконнекти та виклик VAR-Арбітра
                </strong>
                При розриві з&apos;єднання доігруються хвилини, що залишилися, зі
                збереженням поточного рахунку. У разі спірної ситуації кнопка
                «Викликати VAR-Суддю» передає протокол матчу організатору.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
