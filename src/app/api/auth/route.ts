import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, uid, verifyPassword } from '@/lib/crypto-utils';
import {
  clearSessionCookie,
  getCurrentUser,
  mapUserRow,
  setSessionCookie,
} from '@/lib/session';
import { updateUserProfile } from '@/lib/tournament-engine';
import type { PlatformType } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = String(body.action || '');
    const db = getDb();

    if (action === 'logout') {
      await clearSessionCookie();
      return NextResponse.json({ ok: true, user: null });
    }

    if (action === 'quick_demo') {
      if (process.env.DISABLE_DEMO_SWITCH === 'true') {
        return NextResponse.json(
          { error: 'Демо-перемикач вимкнено у production-середовищі.' },
          { status: 403 }
        );
      }
      const targetEmail =
        body.role === 'ADMIN' ? 'admin@cyberliga.ua' : 'kozak@cyberliga.ua';
      const row = db
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(targetEmail);
      if (!row) {
        return NextResponse.json(
          { error: 'Демо-акаунт не знайдено.' },
          { status: 404 }
        );
      }
      const user = mapUserRow(row);
      await setSessionCookie(user.id);
      return NextResponse.json({ ok: true, user });
    }

    if (action === 'login') {
      const identifier = String(body.identifier || '').trim();
      const password = String(body.password || '');
      if (!identifier || !password) {
        return NextResponse.json(
          { error: 'Введіть email або нікнейм та пароль.' },
          { status: 400 }
        );
      }

      const row = db
        .prepare(
          'SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(nickname) = LOWER(?)'
        )
        .get(identifier, identifier);

      if (!row || !verifyPassword(password, String(row.password_hash))) {
        return NextResponse.json(
          { error: 'Невірний логін або пароль.' },
          { status: 401 }
        );
      }

      const user = mapUserRow(row);
      await setSessionCookie(user.id);
      return NextResponse.json({ ok: true, user });
    }

    if (action === 'register') {
      const nickname = String(body.nickname || '').trim();
      const fullName = String(body.fullName || '').trim();
      const email = String(body.email || '')
        .trim()
        .toLowerCase();
      const password = String(body.password || '');
      const city = String(body.city || '').trim();
      const platform = ['PS5', 'PC', 'XBOX'].includes(body.platform)
        ? (body.platform as PlatformType)
        : null;
      const eaId = String(body.eaId || '').trim();
      const telegram = String(body.telegram || '').trim();

      if (!nickname || nickname.length < 3) {
        return NextResponse.json(
          { error: 'Ігровий нікнейм повинен містити щонайменше 3 символи.' },
          { status: 400 }
        );
      }
      if (!fullName || fullName.length < 2) {
        return NextResponse.json(
          { error: 'Будь ласка, вкажіть ваше Ім’я та Прізвище.' },
          { status: 400 }
        );
      }
      if (!eaId || eaId.length < 2) {
        return NextResponse.json(
          { error: 'Вкажіть ваш EA ID / PSN ID для запрошень у матч 1v1.' },
          { status: 400 }
        );
      }
      if (!platform) {
        return NextResponse.json(
          { error: 'Оберіть вашу ігрову платформу (PS5, PC або Xbox).' },
          { status: 400 }
        );
      }
      if (!city || city.length < 2) {
        return NextResponse.json(
          { error: 'Оберіть або вкажіть ваше місто (Україна або Європа).' },
          { status: 400 }
        );
      }
      if (!telegram || telegram.length < 2) {
        return NextResponse.json(
          { error: 'Вкажіть ваш Telegram для домовленості про матчі 1v1.' },
          { status: 400 }
        );
      }
      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { error: 'Вкажіть коректний Email.' },
          { status: 400 }
        );
      }
      if (!password || password.length < 5) {
        return NextResponse.json(
          { error: 'Пароль має містити щонайменше 5 символів.' },
          { status: 400 }
        );
      }

      const dup = db
        .prepare(
          'SELECT id FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(nickname) = LOWER(?)'
        )
        .get(email, nickname);
      if (dup) {
        return NextResponse.json(
          { error: 'Користувач з таким нікнеймом або email вже існує.' },
          { status: 409 }
        );
      }

      const id = uid('usr');
      const colors = ['#00F59B', '#38BDF8', '#F5C451', '#A78BFA', '#FB7185'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const tgFormatted = telegram.startsWith('@') ? telegram : `@${telegram}`;

      db.prepare(
        `
        INSERT INTO users (
          id, nickname, full_name, email, password_hash, city, platform, ea_id, telegram,
          role, season_points, wins, draws, losses, goals_for, goals_against,
          tournaments_won, qualified_annual, avatar_color, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PLAYER', 0, 0, 0, 0, 0, 0, 0, 0, ?, ?)
      `
      ).run(
        id,
        nickname,
        fullName,
        email,
        hashPassword(password),
        city,
        platform,
        eaId,
        tgFormatted,
        color,
        new Date().toISOString()
      );

      const createdRow = db
        .prepare('SELECT * FROM users WHERE id = ?')
        .get(id)!;
      const user = mapUserRow(createdRow);
      await setSessionCookie(user.id);
      return NextResponse.json({ ok: true, user });
    }

    if (action === 'update_profile') {
      const current = await getCurrentUser();
      if (!current) {
        return NextResponse.json(
          { error: 'Необхідна авторизація.' },
          { status: 401 }
        );
      }

      const targetUserId =
        current.role === 'ADMIN' && body.targetUserId
          ? String(body.targetUserId)
          : current.id;

      const updated = updateUserProfile(targetUserId, {
        fullName:
          body.fullName !== undefined ? String(body.fullName) : undefined,
        city: body.city !== undefined ? String(body.city) : undefined,
        platform: ['PS5', 'PC', 'XBOX'].includes(body.platform)
          ? (body.platform as PlatformType)
          : undefined,
        eaId: body.eaId !== undefined ? String(body.eaId) : undefined,
        telegram:
          body.telegram !== undefined ? String(body.telegram) : undefined,
        payoutCard:
          body.payoutCard !== undefined ? String(body.payoutCard) : undefined,
        avatarColor:
          body.avatarColor !== undefined ? String(body.avatarColor) : undefined,
        avatarUrl:
          body.avatarUrl !== undefined ? String(body.avatarUrl) : undefined,
        newPassword:
          body.newPassword !== undefined ? String(body.newPassword) : undefined,
      });

      return NextResponse.json({ ok: true, user: updated });
    }

    return NextResponse.json({ error: 'Невідома дія.' }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Помилка сервера';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

