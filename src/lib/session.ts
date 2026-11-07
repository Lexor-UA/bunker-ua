import { cookies } from 'next/headers';
import { getDb } from './db';
import { signSessionToken, verifySessionToken } from './crypto-utils';
import type { PlatformType, User, UserRole } from './types';

export const SESSION_COOKIE_NAME = 'cyberliga_ua_session';

export function mapUserRow(row: Record<string, unknown>): User {
  return {
    id: String(row.id),
    nickname: String(row.nickname),
    fullName: String(row.full_name),
    email: String(row.email),
    city: String(row.city),
    platform: String(row.platform) as PlatformType,
    eaId: String(row.ea_id),
    telegram: String(row.telegram),
    role: String(row.role) as UserRole,
    seasonPoints: Number(row.season_points),
    wins: Number(row.wins),
    draws: Number(row.draws),
    losses: Number(row.losses),
    goalsFor: Number(row.goals_for),
    goalsAgainst: Number(row.goals_against),
    tournamentsWon: Number(row.tournaments_won),
    qualifiedAnnual: Boolean(Number(row.qualified_annual)),
    avatarColor: String(row.avatar_color),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : '',
    payoutCard: row.payout_card ? String(row.payout_card) : '',
    createdAt: String(row.created_at),
  };
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const userId = verifySessionToken(token);
  if (!userId) return null;

  const db = getDb();
  const row = db
    .prepare('SELECT * FROM users WHERE id = ?')
    .get(userId);
  if (!row) return null;
  return mapUserRow(row);
}

export async function setSessionCookie(userId: string) {
  const token = signSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

