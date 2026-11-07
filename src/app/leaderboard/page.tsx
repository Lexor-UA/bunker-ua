import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Crown,
  Flame,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  getLeaderboard,
  listTournaments,
} from '@/lib/tournament-engine';
import {
  NfcIcon,
  TacticalPitchArt,
  VectorGoldTrophy,
} from '@/components/FintechArt';
import { HoloCard } from '@/components/HoloCard';
import { LeaderboardClient } from '@/components/LeaderboardClient';
import { ProPlayerCard } from '@/components/ProPlayerCard';
import { MonoCardChip, UaFlag } from '@/components/UaFlag';

export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
  const players = getLeaderboard();
  const tournaments = listTournaments();
  const monthlyCups = tournaments.filter((t) => t.cupType === 'MONTHLY');
  const top3 = players.slice(0, 3);
  const monthlyChampions = players.filter((p) => p.qualifiedAnnual);
  const ticketsIssued = monthlyChampions.length;
  const ticketsPct = Math.round((ticketsIssued / 12) * 100);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 space-y-12 pb-6">
      {/* 1. MONOBANK IRON x DIIA HERO STAGE */}
      <section className="relative rounded-[34px] overflow-hidden glass-panel p-7 sm:p-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-45">
            <TacticalPitchArt accent="gold" />
          </div>
          <div
            aria-hidden="true"
            className="absolute -top-20 right-16 w-96 h-60 rounded-full opacity-25 blur-3xl diia-iridescent-bg"
          />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full diia-iridescent-subtle border border-white/15 text-xs font-bold text-white">
              <UaFlag className="w-3.5 h-2.5" />
              <span>БУНКЕР • Рейтинг сезону 2026/27</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.04em]">
              Рейтинг гравців{' '}
              <span className="diia-gradient-text">України</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Кожен матч у групах і плей-офф благодійних турнірів приносить очки
              сезону. Переможці кубків отримують пам’ятну нагороду від воїнів
              ЗСУ 🎖️ та пряму путівку у підсумковий Гранд-Фінал Сезону.
            </p>

            {/* 3 Crisp Quota Capsules */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs font-bold">
              <span className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-white">
                Благодійна ліга ЗСУ 🇺🇦
              </span>
              <span className="px-4 py-2 rounded-full bg-amber-400/15 border border-amber-400/30 text-gold">
                🎖️ Нагорода від воїнів ЗСУ
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-400/15 border border-emerald-400/25 text-pitch">
                100% донатів у Project Ukraine
              </span>
            </div>
          </div>

          {/* Right Mini Grand Final Pass */}
          <div className="lg:col-span-5">
            <Link
              href="/tournaments/november-cup-2026"
              className="block group"
            >
              <HoloCard
                variant="gold"
                className="rounded-[28px] mono-iron-surface p-6 min-h-[176px] flex flex-col justify-between"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 inset-y-0 w-36 flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
                >
                  <VectorGoldTrophy className="w-32 h-32" />
                </div>

                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <MonoCardChip tone="gold" />
                    <NfcIcon className="w-4 h-4 text-amber-200/80" />
                    <span className="px-2.5 py-0.5 rounded-full bg-gold text-[#09090B] text-[0.65rem] font-extrabold">
                      ПРИЗ • НАГОРОДА ВІД ЗСУ
                    </span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-[#09090B] text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="relative z-10 my-2 max-w-[66%]">
                  <div className="text-xs text-slate-300 font-medium">
                    Благодійний Турнір 1v1 • Від 10 ₴ на Банку ЗСУ
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1 leading-tight">
                    🎖️ Пам’ятна нагорода від воїнів ЗСУ
                  </div>
                </div>

                <div className="relative z-10 text-xs font-bold text-amber-200 inline-flex items-center gap-1">
                  <span>Перейти до реєстрації в турнірі</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </HoloCard>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TOP-3 DIIA PLAYER ID PODIUM */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
            Подіум сезону • ТОП-3 України
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Офіційні цифрові картки лідерів рейтингу 1v1
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {([1, 2, 3] as const).map((slotRank, idx) => {
            const p = top3[idx];
            if (p) {
              return (
                <ProPlayerCard
                  key={p.id}
                  player={p}
                  rank={slotRank}
                />
              );
            }
            return (
              <Link
                key={`podium-empty-${slotRank}`}
                href="/tournaments"
                className="rounded-[30px] glass-panel border border-dashed border-white/20 hover:border-pitch/50 p-6 flex flex-col justify-between gap-5 transition-all group min-h-[260px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 text-[0.68rem] font-extrabold text-slate-200">
                    Вільний слот #{slotRank} в Україні
                  </span>
                  <span className="text-xs font-bold text-pitch">
                    Старт сезону
                  </span>
                </div>

                <div className="my-auto space-y-2">
                  <h3 className="font-display text-xl font-extrabold text-white">
                    Місце на подіумі вільне
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Турніри сезону ще не розпочалися. Візьміть участь у першому
                    Кубку України 1v1, щоб здобути очки рейтингу.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-extrabold text-white group-hover:text-pitch transition-colors">
                  <span>Перейти до відкритих кубків</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. GOLDEN TICKETS BENTO (FULL 4-COLUMN HARMONIOUS GRID — ZERO EMPTY SPACE) */}
      <section className="glass-panel rounded-[32px] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              <span>Золоті квитки у Гранд-Фінал ({ticketsIssued} із 12)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Переможець кожного Місячного Кубка гарантовано потрапляє у Кошик
              #1 Річного Фіналу.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-xs font-extrabold text-gold">
            Посів Кошика #1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {monthlyChampions.map((champ, idx) => (
            <Link
              key={champ.id}
              href={`/players/${encodeURIComponent(champ.nickname)}`}
              className="p-4 rounded-[24px] mono-iron-surface hover:border-amber-300/60 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-gold text-[#09090B] text-[0.62rem] font-extrabold">
                  КВИТОК #{idx + 1}
                </span>
                <span className="text-[0.68rem] font-mono text-amber-200 font-bold tabular-nums">
                  {champ.seasonPoints} pts
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl font-display font-extrabold text-sm text-[#09090B] flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: champ.avatarColor }}
                >
                  {champ.nickname.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base font-extrabold text-white group-hover:text-gold truncate transition-colors">
                    {champ.nickname}
                  </div>
                  <div className="text-xs text-slate-300 inline-flex items-center gap-1.5 truncate">
                    <UaFlag className="w-3.5 h-2.5" />
                    <span>
                      {champ.city} • {champ.platform}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[0.68rem] text-slate-300">
                <span className="inline-flex items-center gap-1 text-gold font-bold">
                  <Trophy className="w-3.5 h-3.5" /> Титулів:{' '}
                  {champ.tournamentsWon}
                </span>
                <span className="text-pitch font-bold">Паспорт гравця →</span>
              </div>
            </Link>
          ))}

          {/* Active Monthly Cups Offering Golden Tickets */}
          {monthlyCups.slice(0, Math.max(1, 3 - monthlyChampions.length)).map((cup, idx) => (
            <Link
              key={cup.id}
              href={`/tournaments/${cup.slug}`}
              className="p-4 rounded-[24px] diia-card-surface hover:border-white/40 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full diia-iridescent-bg text-[#09090B] text-[0.62rem] font-extrabold">
                  КВИТОК #{ticketsIssued + idx + 1} • РОЗІГРУЄТЬСЯ
                </span>
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              <div>
                <div className="font-display text-base font-extrabold text-white truncate">
                  {cup.title}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Реєстрація відкрита ({cup.participantCount ?? 0}/
                  {cup.maxPlayers} місць) • 🎖️ Нагорода від ЗСУ + Путівка
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.08] text-xs font-extrabold text-white inline-flex items-center gap-1">
                <span>Зареєструватися на кубок</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}

          {/* Card 4: Remaining Season Quota Meter */}
          <div className="p-4 rounded-[24px] bg-[#10121A]/65 border border-white/[0.12] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pitch" />
                Квота путівок року
              </span>
              <span className="font-mono font-extrabold text-white tabular-nums">
                {ticketsIssued}/12
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="font-display text-lg font-extrabold text-white">
                Ще {12 - ticketsIssued} прямих квитків
              </div>
              <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full diia-iridescent-bg"
                  style={{ width: `${Math.max(10, ticketsPct)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-[0.68rem] text-slate-400">
              + 20 місць у Гранд-Фінал за очками рейтингу нижче
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE RANKING TABLE WITH SEARCH & PLATFORM PILLS */}
      <LeaderboardClient players={players} />

      {/* 5. POINTS FORMULA BENTO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel rounded-[28px] p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-gold font-display text-base font-extrabold">
            <Flame className="w-4 h-4" />
            <span>Нарахування очок за Кубок</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            1 місце: <strong className="text-white">250 pts + Квиток</strong> •
            2 місце: <strong className="text-white">180 pts</strong> • 3 місце:{' '}
            <strong className="text-white">135 pts</strong> • 4 місце:{' '}
            <strong className="text-white">110 pts</strong> • 1/4 фіналу:{' '}
            <strong className="text-white">75 pts</strong> • Група:{' '}
            <strong className="text-white">25 pts</strong>.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-pitch font-display text-base font-extrabold">
            <Award className="w-4 h-4" />
            <span>Вплив на посів у Групах</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Перед стартом кожного Місячного Кубка гравці автоматично діляться на
            4 кошики за цим рейтингом, щоб лідери не зустрічалися в одній групі.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-sky-300 font-display text-base font-extrabold">
            <Crown className="w-4 h-4" />
            <span>Кваліфікація у Гранд-Фінал</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Навіть без перемоги в окремому кубку стабільні виходи з групи
            тримають вас у прохідній зоні та гарантують місце у підсумковому
            Фіналі Сезону за головну нагороду від ЗСУ.
          </p>
        </div>
      </section>
    </div>
  );
}
