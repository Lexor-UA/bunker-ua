import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import {
  cleanDemoDataForRelease,
  createTournament,
  getEaComplianceSummary,
  listTournaments,
  restoreDemoSeedData,
} from '@/lib/tournament-engine';
import type { ClubPoolType, CupType, GameMode } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  const tournaments = listTournaments();
  const compliance = getEaComplianceSummary(2026);
  return NextResponse.json({ tournaments, compliance });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ дозволено лише адміністратору платформи.' },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (body.action === 'clean_demo_data') {
      const mode = body.mode === 'full_wipe' ? 'full_wipe' : 'keep_cups';
      const result = cleanDemoDataForRelease(mode);
      return NextResponse.json({ ok: true, ...result });
    }

    if (body.action === 'restore_demo_data') {
      const result = restoreDemoSeedData();
      return NextResponse.json({ ok: true, ...result });
    }

    const maxPlayersRaw = Number(body.maxPlayers);
    const maxPlayers: 8 | 16 | 32 =
      maxPlayersRaw === 8 || maxPlayersRaw === 32 ? maxPlayersRaw : 16;

    const tournament = createTournament({
      title: String(body.title || 'Новий Кубок України 1v1'),
      subtitle: String(body.subtitle || ''),
      cupType: (body.cupType === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY') as CupType,
      gameMode: (body.gameMode === 'ULTIMATE_TEAM'
        ? 'ULTIMATE_TEAM'
        : 'KICKOFF_CLUB_DRAFT') as GameMode,
      clubPool: (['ALL_TOP', 'BALANCED_45', 'ELITE_5', 'NONE'].includes(
        body.clubPool
      )
        ? body.clubPool
        : 'BALANCED_45') as ClubPoolType,
      equal95Ovr: Boolean(body.equal95Ovr),
      prizePoolUah: Number(body.prizePoolUah ?? 10000),
      entryFeeUah: Number(body.entryFeeUah ?? 0),
      maxPlayers,
      monthLabel: String(body.monthLabel || 'Сезон 2026/27'),
      startDate: String(body.startDate || '2026-11-28'),
      rulesNote: String(body.rulesNote || ''),
    });

    return NextResponse.json({ ok: true, tournament });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'Помилка створення турніру';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

