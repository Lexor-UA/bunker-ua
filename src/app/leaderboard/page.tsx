import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Cpu,
  Crown,
  Flame,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  getLeaderboard,
  listTournaments,
} from '@/lib/tournament-engine';
import { BunkerAiMatchPredictor } from '@/components/BunkerAiMatchPredictor';
import { getSmartInitials } from '@/components/ClubCrest';
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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 space-y-14 pb-10">
      {/* 1. UEFA CHAMPIONS LEAGUE x BUNKER FC 1v1 LEADERBOARD HERO STAGE */}
      <section className="relative rounded-[36px] overflow-hidden glass-panel border border-sky-400/25 p-7 sm:p-10 shadow-[0_28px_80px_rgba(2,6,23,0.85)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] diia-iridescent-bg"
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-35">
            <TacticalPitchArt accent="gold" />
          </div>
          <div
            aria-hidden="true"
            className="absolute -top-20 right-16 w-96 h-60 rounded-full opacity-25 blur-3xl diia-iridescent-bg"
          />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#07112E]/90 border border-amber-400/35 text-xs font-extrabold text-white">
              <UaFlag className="w-4 h-3" />
              <span className="uppercase tracking-wider">
                BUNKER FC 1V1 • UKRAINE • РЕЙТИНГ СЕЗОНУ 2026/27
              </span>
              <Cpu className="w-3.5 h-3.5 text-sky-300" />
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.035em] uppercase">
              Національний Рейтинг{' '}
              <span className="diia-gradient-text">Гравців України</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200/95 max-w-2xl leading-relaxed">
              Кожен офіційний матч у групах і сітці Плей-офф формує ваш{' '}
              <strong className="text-sky-300">FUT OVR та AI Індекс Сили</strong>
              . Переможці кубків отримують{' '}
              <strong className="text-gold">
                пам’ятний трофей від воїнів ЗСУ
              </strong>{' '}
              та пряму путівку у Підсумковий Кубок Сезону.
            </p>

            {/* 3 Crisp Quota Capsules */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs font-bold">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#040A1C]/90 border border-sky-400/25 text-white">
                <UaFlag className="w-3.5 h-2.5" />
                <span>Благодійна ліга на підтримку ЗСУ</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400/15 border border-amber-400/35 text-gold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Трофей від воїнів ЗСУ</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-400/15 border border-sky-400/30 text-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>100% донатів у фонд Project Ukraine</span>
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
                className="rounded-[30px] bg-gradient-to-br from-[#0A1432] via-[#060D24] to-[#1E160B] border border-gold/40 p-6 min-h-[188px] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
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
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] text-[0.65rem] font-extrabold">
                      ПРИЗ • ТРОФЕЙ ВІД ЗСУ
                    </span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-gold group-hover:text-[#040814] text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="relative z-10 my-2 max-w-[66%]">
                  <div className="text-xs text-sky-200/90 font-medium">
                    Благодійний Турнір #2 • Внесок від 10 ₴ на Банку ЗСУ
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1 leading-tight">
                    Ексклюзивна нагорода від воїнів ЗСУ
                  </div>
                </div>

                <div className="relative z-10 text-xs font-extrabold text-gold inline-flex items-center gap-1">
                  <span>Подати заявку в Турнір #2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </HoloCard>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TOP-3 UKRAINE PODIUM */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span>ОФІЦІЙНІ ПАСПОРТИ ЛІДЕРІВ • BUNKER ID</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Подіум сезону • ТОП-3 України
            </h2>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-[#060E24] border border-sky-400/25 text-xs text-sky-200 font-mono font-bold">
            Live FUT OVR + AI Телеметрія
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
            return null;
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE RANKING TABLE WITH AI OVR & FORM INDEX */}
      <LeaderboardClient players={players} />

      {/* 4. BUNKER AI HEAD-TO-HEAD SIMULATOR */}
      <BunkerAiMatchPredictor players={players} />

      {/* 5. GOLDEN TICKETS BENTO */}
      <section className="glass-panel rounded-[32px] border border-sky-400/25 p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              <span>Золоті квитки у Гранд-Фінал ({ticketsIssued} із 12)</span>
            </h2>
            <p className="text-xs text-slate-300">
              Переможець кожного благодійного кубка гарантовано потрапляє у
              Кошик #1 Підсумкового Кубка Сезону.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/35 text-xs font-extrabold text-gold">
            Посів Кошика #1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {monthlyChampions.map((champ, idx) => (
            <Link
              key={champ.id}
              href={`/players/${encodeURIComponent(champ.nickname)}`}
              className="p-4 rounded-[24px] bg-[#050C20]/90 border border-gold/35 hover:border-gold transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-gold text-[#040814] text-[0.62rem] font-extrabold">
                  КВИТОК #{idx + 1}
                </span>
                <span className="text-[0.68rem] font-mono text-gold font-bold tabular-nums">
                  {champ.seasonPoints} PTS
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl font-display font-extrabold text-sm text-[#040814] flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: champ.avatarColor }}
                >
                  {getSmartInitials(champ.nickname)}
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
                <span className="text-sky-300 font-bold">Паспорт гравця →</span>
              </div>
            </Link>
          ))}

          {/* Active Monthly Cups Offering Golden Tickets */}
          {monthlyCups
            .slice(0, Math.max(1, 3 - monthlyChampions.length))
            .map((cup, idx) => (
              <Link
                key={cup.id}
                href={`/tournaments/${cup.slug}`}
                className="p-4 rounded-[24px] diia-card-surface border border-sky-400/25 hover:border-gold/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full diia-iridescent-bg text-[#040814] text-[0.62rem] font-extrabold">
                    КВИТОК #{ticketsIssued + idx + 1} • РОЗІГРУЄТЬСЯ
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                <div>
                  <div className="font-display text-base font-extrabold text-white truncate">
                    {cup.title}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Статус: {cup.participantCount ?? 0}/{cup.maxPlayers}{' '}
                    учасників • Трофей від ЗСУ + Путівка
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.08] text-xs font-extrabold text-gold inline-flex items-center gap-1">
                  <span>Відкрити сторінку турніру</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}

          {/* Card 4: Remaining Season Quota Meter */}
          <div className="p-4 rounded-[24px] bg-[#040A1C]/85 border border-sky-400/20 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
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

            <div className="pt-2 border-t border-white/[0.06] text-[0.68rem] text-slate-300">
              + Відбір у ТОП-16 Підсумкового Кубка Сезону за очками
            </div>
          </div>
        </div>
      </section>

      {/* 6. POINTS FORMULA BENTO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel rounded-[28px] border border-sky-400/20 p-6 space-y-2.5">
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

        <div className="glass-panel rounded-[28px] border border-sky-400/20 p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-sky-300 font-display text-base font-extrabold">
            <Award className="w-4 h-4" />
            <span>AI-Індекс та посів у Групах</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Перед стартом кожного Благодійного Кубка платформа автоматично
            розподіляє гравців за рейтингом та AI Power Index, щоб фаворити не
            зустрічалися в одній групі.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] border border-sky-400/20 p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-gold font-display text-base font-extrabold">
            <Crown className="w-4 h-4" />
            <span>Кваліфікація у Гранд-Фінал</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Стабільні виходи з групи у Плей-офф тримають вас у прохідній зоні та
            гарантують місце у Підсумковому Кубку Сезону за головний трофей від
            воїнів ЗСУ.
          </p>
        </div>
      </section>
    </div>
  );
}
