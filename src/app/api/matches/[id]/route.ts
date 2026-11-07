import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import {
  awardTechnicalWin,
  checkInMatch,
  confirmPendingMatch,
  disputeMatch,
  submitMatchResult,
} from '@/lib/tournament-engine';

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
        { error: 'Авторизуйтесь для внесення або підтвердження рахунку.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const action = String(body.action || '');

    if (action === 'submit_score') {
      const score1 = Number(body.score1);
      const score2 = Number(body.score2);
      const penalties1 =
        body.penalties1 !== undefined &&
        body.penalties1 !== null &&
        body.penalties1 !== ''
          ? Number(body.penalties1)
          : null;
      const penalties2 =
        body.penalties2 !== undefined &&
        body.penalties2 !== null &&
        body.penalties2 !== ''
          ? Number(body.penalties2)
          : null;

      submitMatchResult({
        matchId: id,
        actor: user,
        score1,
        score2,
        penalties1,
        penalties2,
        proofImageUrl: body.proofImageUrl ? String(body.proofImageUrl) : null,
        adminNote: body.adminNote ? String(body.adminNote) : null,
        instantConfirm: Boolean(body.instantConfirm) && user.role === 'ADMIN',
      });

      return NextResponse.json({ ok: true });
    }

    if (action === 'confirm_score') {
      confirmPendingMatch(id, user);
      return NextResponse.json({ ok: true });
    }

    if (action === 'dispute') {
      disputeMatch({
        matchId: id,
        actor: user,
        reason: String(body.reason || ''),
        disputeImageUrl: body.disputeImageUrl
          ? String(body.disputeImageUrl)
          : null,
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'check_in') {
      checkInMatch(id, user);
      return NextResponse.json({ ok: true });
    }

    if (action === 'technical_win') {
      const winnerSlot = Number(body.winnerSlot) === 2 ? 2 : 1;
      awardTechnicalWin({
        matchId: id,
        winnerSlot,
        actor: user,
        reason: body.reason ? String(body.reason) : undefined,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Невідома дія матчу.' }, { status: 400 });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'Помилка оновлення матчу';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

