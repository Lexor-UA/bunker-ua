import React from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { getLeaderboard } from '@/lib/tournament-engine';
import { LeaderboardClient } from '@/components/LeaderboardClient';
import { ProPlayerCard } from '@/components/ProPlayerCard';
import { UaFlag } from '@/components/UaFlag';

export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
  const players = getLeaderboard();
  const top3 = players.slice(0, 3);

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 space-y-12 pb-12">
      {/* 1. CLEAN LEADERBOARD HEADER */}
      <section className="glass-panel rounded-[32px] border border-white/[0.1] p-7 sm:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-bold text-white">
            <UaFlag className="w-3.5 h-2.5" />
            <span>Сезон 2026/27 • Рейтинг гравців України</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.03em]">
            Таблиця лідерів <span className="diia-gradient-text">BUNKER FC 1v1</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Очки нараховуються за кожен зіграний благодійний турнір. ТОП-16
            гравців сезону отримують путівку у Підсумковий Кубок Сезону за
            головний трофей від воїнів ЗСУ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/tournaments/november-cup-2026"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F5C451] to-[#D97706] text-[#040814] hover:brightness-110 text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-all shadow-[0_12px_28px_rgba(245,196,81,0.3)]"
          >
            <Trophy className="w-4 h-4" />
            <span>Подати заявку на Турнір #2</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 2. TOP-3 PODIUM */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([1, 2, 3] as const).map((slotRank, idx) => {
          const p = top3[idx];
          if (p) {
            return <ProPlayerCard key={p.id} player={p} rank={slotRank} />;
          }
          return null;
        })}
      </section>

      {/* 3. FULL RANKING TABLE */}
      <LeaderboardClient players={players} />
    </div>
  );
}
