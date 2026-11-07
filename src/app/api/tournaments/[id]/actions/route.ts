import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import {
  deleteTournament,
  fillTournamentWithDemoPlayers,
  finalizeTournamentAndAwardPoints,
  generatePlayoffBracket,
  registerPlayerForTournament,
  runClubDraft,
  runGroupDraw,
  simulateRemainingGroupMatches,
  unregisterPlayerFromTournament,
  updateTournamentDetails,
} from '@/lib/tournament-engine';
import type { ClubPoolType } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Спочатку увійдіть в акаунт гравця або адміністратора.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const action = String(body.action || '');

    if (action === 'register') {
      const participant = registerPlayerForTournament(id, user.id);
      return NextResponse.json({ ok: true, participant });
    }

    if (action === 'unregister') {
      unregisterPlayerFromTournament(id, user.id, user);
      return NextResponse.json({ ok: true });
    }

    // Усі наступні дії керування турніром вимагають прав ADMIN
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Ця дія доступна лише Головному Судді / Адміністратору.' },
        { status: 403 }
      );
    }

    if (action === 'remove_participant') {
      const targetUserId = String(body.userId || '');
      if (!targetUserId) {
        return NextResponse.json(
          { error: 'Не вказано ID гравця для виключення.' },
          { status: 400 }
        );
      }
      unregisterPlayerFromTournament(id, targetUserId, user);
      return NextResponse.json({ ok: true });
    }

    if (action === 'update_tournament') {
      const maxPlayersRaw = Number(body.maxPlayers);
      const maxPlayers: 8 | 16 | 32 =
        maxPlayersRaw === 8 || maxPlayersRaw === 32 ? maxPlayersRaw : 16;

      const updated = updateTournamentDetails(id, {
        title: String(body.title || ''),
        subtitle: String(body.subtitle || ''),
        prizePoolUah: Number(body.prizePoolUah ?? 10000),
        entryFeeUah: Number(body.entryFeeUah ?? 0),
        maxPlayers,
        monthLabel: String(body.monthLabel || ''),
        startDate: String(body.startDate || ''),
        rulesNote: String(body.rulesNote || ''),
        clubPool: ['ALL_TOP', 'BALANCED_45', 'ELITE_5', 'NONE'].includes(
          body.clubPool
        )
          ? (body.clubPool as ClubPoolType)
          : undefined,
        equal95Ovr:
          body.equal95Ovr !== undefined ? Boolean(body.equal95Ovr) : undefined,
      });
      return NextResponse.json({ ok: true, tournament: updated });
    }

    if (action === 'delete_tournament') {
      deleteTournament(id);
      return NextResponse.json({ ok: true });
    }

    if (action === 'fill_demo') {
      const added = fillTournamentWithDemoPlayers(id);
      return NextResponse.json({ ok: true, added });
    }

    if (action === 'club_draft') {
      const participants = runClubDraft(id);
      return NextResponse.json({ ok: true, participants });
    }

    if (action === 'group_draw') {
      const result = runGroupDraw(id);
      return NextResponse.json({ ok: true, ...result });
    }

    if (action === 'simulate_groups') {
      const simulated = simulateRemainingGroupMatches(id);
      return NextResponse.json({ ok: true, simulated });
    }

    if (action === 'generate_playoff') {
      const playoffMatches = generatePlayoffBracket(id);
      return NextResponse.json({ ok: true, playoffMatches });
    }

    if (action === 'finalize') {
      const tournament = finalizeTournamentAndAwardPoints(id);
      return NextResponse.json({ ok: true, tournament });
    }

    return NextResponse.json({ error: 'Невідома дія.' }, { status: 400 });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'Помилка виконання операції';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

