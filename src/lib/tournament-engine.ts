import { getDb, runInTransaction } from './db';
import { getClubById, getClubsForPool } from './clubs';
import { hashPassword, shuffleCrypto, uid } from './crypto-utils';
import { seedDatabase } from './seed';
import {
  ANNUAL_DEFAULT_PRIZES,
  EA_ANNUAL_PRIZE_CAP_UAH,
  EA_ANNUAL_PRIZE_CAP_USD,
  EA_MAX_ENTRY_FEE_UAH,
  EA_MAX_ENTRY_FEE_USD,
  MONTHLY_DEFAULT_PRIZES,
  UAH_PER_USD_RATE,
  UKRAINIAN_CITIES,
} from './constants';
import { mapUserRow } from './session';
import type {
  ClubPoolType,
  CupType,
  EaComplianceSummary,
  GameMode,
  GroupStandingRow,
  Match,
  MatchPlayerInfo,
  MatchStage,
  MatchStatus,
  Participant,
  PlatformType,
  PlayerProfileData,
  PlayerTournamentParticipation,
  PlayoffRound,
  PrizeTier,
  Tournament,
  TournamentStatus,
  User,
} from './types';

function mapTournamentRow(row: Record<string, unknown>): Tournament {
  let prizeBreakdown: PrizeTier[] = [];
  try {
    prizeBreakdown = JSON.parse(String(row.prize_breakdown_json || '[]'));
  } catch {
    prizeBreakdown = [];
  }
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: String(row.subtitle),
    cupType: String(row.cup_type) as CupType,
    gameMode: String(row.game_mode) as GameMode,
    clubPool: String(row.club_pool) as ClubPoolType,
    equal95Ovr: Boolean(Number(row.equal_95_ovr)),
    prizePoolUah: Number(row.prize_pool_uah),
    entryFeeUah: Number(row.entry_fee_uah),
    maxPlayers: Number(row.max_players) as 8 | 16 | 32,
    groupSize: 4,
    status: String(row.status) as TournamentStatus,
    seasonYear: Number(row.season_year),
    monthLabel: String(row.month_label),
    startDate: String(row.start_date),
    rulesNote: String(row.rules_note),
    prizeBreakdown,
    championUserId: row.champion_user_id ? String(row.champion_user_id) : null,
    participantCount:
      row.participant_count !== undefined
        ? Number(row.participant_count)
        : undefined,
    championNickname: row.champion_nickname
      ? String(row.champion_nickname)
      : null,
    createdAt: String(row.created_at),
  };
}

export function listTournaments(): Tournament[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT
        t.*,
        (SELECT COUNT(*) FROM participants p WHERE p.tournament_id = t.id) AS participant_count,
        u.nickname AS champion_nickname
      FROM tournaments t
      LEFT JOIN users u ON u.id = t.champion_user_id
      ORDER BY
        CASE t.cup_type WHEN 'ANNUAL' THEN 0 ELSE 1 END DESC,
        t.start_date ASC
    `
    )
    .all();
  return rows.map(mapTournamentRow);
}

export function getTournamentBySlugOrId(slugOrId: string): Tournament | null {
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT
        t.*,
        (SELECT COUNT(*) FROM participants p WHERE p.tournament_id = t.id) AS participant_count,
        u.nickname AS champion_nickname
      FROM tournaments t
      LEFT JOIN users u ON u.id = t.champion_user_id
      WHERE t.slug = ? OR t.id = ?
    `
    )
    .get(slugOrId, slugOrId);
  if (!row) return null;
  return mapTournamentRow(row);
}

export function getTournamentParticipants(tournamentId: string): Participant[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT
        p.*,
        u.nickname,
        u.full_name,
        u.city,
        u.platform,
        u.ea_id,
        u.telegram,
        u.season_points,
        u.avatar_color
      FROM participants p
      JOIN users u ON u.id = p.user_id
      WHERE p.tournament_id = ?
      ORDER BY u.season_points DESC, p.registered_at ASC
    `
    )
    .all(tournamentId);

  return rows.map((r) => ({
    id: String(r.id),
    tournamentId: String(r.tournament_id),
    userId: String(r.user_id),
    seedPot: r.seed_pot !== null ? Number(r.seed_pot) : null,
    assignedClubId: r.assigned_club_id ? String(r.assigned_club_id) : null,
    groupName: r.group_name ? String(r.group_name) : null,
    paymentStatus: String(r.payment_status) as 'FREE' | 'PAID',
    registeredAt: String(r.registered_at),
    nickname: String(r.nickname),
    fullName: String(r.full_name),
    city: String(r.city),
    platform: String(r.platform) as PlatformType,
    eaId: String(r.ea_id),
    telegram: String(r.telegram),
    seasonPoints: Number(r.season_points),
    avatarColor: String(r.avatar_color),
    club: getClubById(r.assigned_club_id ? String(r.assigned_club_id) : null),
  }));
}

export function getTournamentMatches(tournamentId: string): Match[] {
  const db = getDb();
  const participants = getTournamentParticipants(tournamentId);
  const participantByUserId = new Map<string, Participant>(
    participants.map((p) => [p.userId, p])
  );

  const fallbackUsersById = new Map<string, User>();
  const getUserStmt = db.prepare('SELECT * FROM users WHERE id = ?');

  const toPlayerInfo = (userId: string | null): MatchPlayerInfo | null => {
    if (!userId) return null;
    const part = participantByUserId.get(userId);
    if (part) {
      return {
        id: part.userId,
        nickname: part.nickname,
        city: part.city,
        platform: part.platform,
        eaId: part.eaId,
        telegram: part.telegram,
        avatarColor: part.avatarColor,
        club: part.club,
      };
    }
    let usr = fallbackUsersById.get(userId);
    if (!usr) {
      const uRow = getUserStmt.get(userId);
      if (!uRow) return null;
      usr = mapUserRow(uRow);
      fallbackUsersById.set(userId, usr);
    }
    return {
      id: usr.id,
      nickname: usr.nickname,
      city: usr.city,
      platform: usr.platform,
      eaId: usr.eaId,
      telegram: usr.telegram,
      avatarColor: usr.avatarColor,
      club: null,
    };
  };

  const rows = db
    .prepare(
      `
      SELECT * FROM matches
      WHERE tournament_id = ?
      ORDER BY stage ASC, group_name ASC, round_number ASC, match_order ASC
    `
    )
    .all(tournamentId);

  return rows.map((r) => {
    const p1Id = r.player1_id ? String(r.player1_id) : null;
    const p2Id = r.player2_id ? String(r.player2_id) : null;
    return {
      id: String(r.id),
      tournamentId: String(r.tournament_id),
      stage: String(r.stage) as MatchStage,
      groupName: r.group_name ? String(r.group_name) : null,
      roundNumber: Number(r.round_number),
      playoffRound: r.playoff_round
        ? (String(r.playoff_round) as PlayoffRound)
        : null,
      matchOrder: Number(r.match_order),
      player1Id: p1Id,
      player2Id: p2Id,
      score1: r.score1 !== null ? Number(r.score1) : null,
      score2: r.score2 !== null ? Number(r.score2) : null,
      penalties1: r.penalties1 !== null ? Number(r.penalties1) : null,
      penalties2: r.penalties2 !== null ? Number(r.penalties2) : null,
      winnerId: r.winner_id ? String(r.winner_id) : null,
      status: String(r.status) as MatchStatus,
      submittedById: r.submitted_by_id ? String(r.submitted_by_id) : null,
      proofImageUrl: r.proof_image_url ? String(r.proof_image_url) : null,
      disputeReason: r.dispute_reason ? String(r.dispute_reason) : null,
      disputeImageUrl: r.dispute_image_url ? String(r.dispute_image_url) : null,
      adminNote: r.admin_note ? String(r.admin_note) : null,
      p1CheckedInAt: r.p1_checked_in_at ? String(r.p1_checked_in_at) : null,
      p2CheckedInAt: r.p2_checked_in_at ? String(r.p2_checked_in_at) : null,
      nextMatchId: r.next_match_id ? String(r.next_match_id) : null,
      nextMatchSlot:
        r.next_match_slot !== null ? (Number(r.next_match_slot) as 1 | 2) : null,
      loserNextMatchId: r.loser_next_match_id
        ? String(r.loser_next_match_id)
        : null,
      loserNextMatchSlot:
        r.loser_next_match_slot !== null
          ? (Number(r.loser_next_match_slot) as 1 | 2)
          : null,
      updatedAt: String(r.updated_at),
      player1: toPlayerInfo(p1Id),
      player2: toPlayerInfo(p2Id),
    };
  });
}

export function computeGroupStandings(
  tournamentId: string
): Record<string, GroupStandingRow[]> {
  const participants = getTournamentParticipants(tournamentId);
  const matches = getTournamentMatches(tournamentId).filter(
    (m) => m.stage === 'GROUP' && m.status === 'COMPLETED'
  );

  const groupedPlayers: Record<string, Participant[]> = {};
  for (const p of participants) {
    if (!p.groupName) continue;
    if (!groupedPlayers[p.groupName]) groupedPlayers[p.groupName] = [];
    groupedPlayers[p.groupName].push(p);
  }

  const result: Record<string, GroupStandingRow[]> = {};

  for (const groupName of Object.keys(groupedPlayers).sort()) {
    const groupParticipants = groupedPlayers[groupName];
    const groupMatches = matches.filter((m) => m.groupName === groupName);

    const statsMap = new Map<string, GroupStandingRow>();
    for (const p of groupParticipants) {
      statsMap.set(p.userId, {
        userId: p.userId,
        nickname: p.nickname,
        city: p.city,
        platform: p.platform,
        eaId: p.eaId,
        avatarColor: p.avatarColor,
        seedPot: p.seedPot,
        club: p.club,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
        rank: 1,
        qualifies: false,
      });
    }

    for (const m of groupMatches) {
      if (!m.player1Id || !m.player2Id || m.score1 === null || m.score2 === null)
        continue;
      const r1 = statsMap.get(m.player1Id);
      const r2 = statsMap.get(m.player2Id);
      if (!r1 || !r2) continue;

      r1.played += 1;
      r2.played += 1;
      r1.gf += m.score1;
      r1.ga += m.score2;
      r2.gf += m.score2;
      r2.ga += m.score1;

      if (m.score1 > m.score2) {
        r1.won += 1;
        r1.points += 3;
        r2.lost += 1;
      } else if (m.score2 > m.score1) {
        r2.won += 1;
        r2.points += 3;
        r1.lost += 1;
      } else {
        r1.drawn += 1;
        r2.drawn += 1;
        r1.points += 1;
        r2.points += 1;
      }
      r1.gd = r1.gf - r1.ga;
      r2.gd = r2.gf - r2.ga;
    }

    // Офіційний багатосторонній тай-брейк (2, 3 або 4 гравці з однаковою кількістю очок):
    // рахуємо міні-таблицю (очки, різниця м'ячів, забиті голи) у матчах тільки між гравцями з цим самим балом
    const byPoints = new Map<number, Set<string>>();
    for (const r of statsMap.values()) {
      if (!byPoints.has(r.points)) byPoints.set(r.points, new Set());
      byPoints.get(r.points)!.add(r.userId);
    }

    const miniTableStats = new Map<
      string,
      { pts: number; gd: number; gf: number }
    >();
    for (const [ptsVal, tiedSet] of byPoints.entries()) {
      if (tiedSet.size < 2) continue;
      for (const uidItem of tiedSet) {
        miniTableStats.set(`${ptsVal}:${uidItem}`, { pts: 0, gd: 0, gf: 0 });
      }
      for (const m of groupMatches) {
        if (
          !m.player1Id ||
          !m.player2Id ||
          m.score1 === null ||
          m.score2 === null
        ) {
          continue;
        }
        if (tiedSet.has(m.player1Id) && tiedSet.has(m.player2Id)) {
          const sA = miniTableStats.get(`${ptsVal}:${m.player1Id}`)!;
          const sB = miniTableStats.get(`${ptsVal}:${m.player2Id}`)!;
          sA.gf += m.score1;
          sB.gf += m.score2;
          sA.gd += m.score1 - m.score2;
          sB.gd += m.score2 - m.score1;
          if (m.score1 > m.score2) {
            sA.pts += 3;
          } else if (m.score2 > m.score1) {
            sB.pts += 3;
          } else {
            sA.pts += 1;
            sB.pts += 1;
          }
        }
      }
    }

    const sorted = Array.from(statsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const miniA = miniTableStats.get(`${a.points}:${a.userId}`);
      const miniB = miniTableStats.get(`${b.points}:${b.userId}`);
      if (miniA && miniB) {
        if (miniB.pts !== miniA.pts) return miniB.pts - miniA.pts;
        if (miniB.gd !== miniA.gd) return miniB.gd - miniA.gd;
        if (miniB.gf !== miniA.gf) return miniB.gf - miniA.gf;
      }
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return (a.seedPot ?? 4) - (b.seedPot ?? 4);
    });

    sorted.forEach((row, index) => {
      row.rank = index + 1;
      row.qualifies = index < 2;
    });

    result[groupName] = sorted;
  }

  return result;
}

export function getLeaderboard(): User[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT * FROM users
      WHERE role = 'PLAYER'
      ORDER BY
        qualified_annual DESC,
        season_points DESC,
        tournaments_won DESC,
        wins DESC,
        (goals_for - goals_against) DESC
    `
    )
    .all();
  return rows.map(mapUserRow);
}

export function getEaComplianceSummary(calendarYear = 2026): EaComplianceSummary {
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT
        COALESCE(SUM(prize_pool_uah), 0) AS total_uah,
        COUNT(*) AS cnt
      FROM tournaments
      WHERE season_year = ?
    `
    )
    .get(calendarYear) as { total_uah: number; cnt: number };

  const totalPrizeUah = Number(row?.total_uah ?? 0);
  const totalPrizeUsd = Math.round((totalPrizeUah / UAH_PER_USD_RATE) * 100) / 100;
  const remainingUah = Math.max(0, EA_ANNUAL_PRIZE_CAP_UAH - totalPrizeUah);
  const remainingUsd =
    Math.round((remainingUah / UAH_PER_USD_RATE) * 100) / 100;
  const usagePercent = Math.min(
    100,
    Math.round((totalPrizeUsd / EA_ANNUAL_PRIZE_CAP_USD) * 1000) / 10
  );

  return {
    calendarYear,
    totalPrizeUah,
    totalPrizeUsd,
    limitUsd: EA_ANNUAL_PRIZE_CAP_USD,
    limitUah: EA_ANNUAL_PRIZE_CAP_UAH,
    remainingUsd,
    remainingUah,
    usagePercent,
    exchangeRateUahPerUsd: UAH_PER_USD_RATE,
    maxEntryFeeUsd: EA_MAX_ENTRY_FEE_USD,
    maxEntryFeeUah: EA_MAX_ENTRY_FEE_UAH,
    isCompliant: totalPrizeUsd <= EA_ANNUAL_PRIZE_CAP_USD,
    tournamentsCount: Number(row?.cnt ?? 0),
  };
}

export function getPendingAndDisputedMatches(): Match[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT m.*, t.title AS tournament_title, t.slug AS tournament_slug
      FROM matches m
      JOIN tournaments t ON t.id = m.tournament_id
      WHERE m.status IN ('DISPUTED', 'PENDING_CONFIRM')
      ORDER BY
        CASE m.status WHEN 'DISPUTED' THEN 0 ELSE 1 END ASC,
        m.updated_at DESC
    `
    )
    .all();

  const result: Match[] = [];
  const cachedByTournament = new Map<string, Map<string, Match>>();

  for (const r of rows) {
    const tId = String(r.tournament_id);
    if (!cachedByTournament.has(tId)) {
      const tMatches = getTournamentMatches(tId);
      cachedByTournament.set(
        tId,
        new Map(tMatches.map((tm) => [tm.id, tm]))
      );
    }
    const hydrated = cachedByTournament.get(tId)?.get(String(r.id));
    if (hydrated) {
      result.push({
        ...hydrated,
        tournamentTitle: String(r.tournament_title),
        tournamentSlug: String(r.tournament_slug),
      });
    }
  }
  return result;
}

export function getRecentTickerMatches(
  limit = 5
): Array<Match & { tournamentSlug: string; tournamentTitle: string }> {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT m.id, m.tournament_id, t.slug AS tournament_slug, t.title AS tournament_title
      FROM matches m
      JOIN tournaments t ON t.id = m.tournament_id
      WHERE m.player1_id IS NOT NULL AND m.player2_id IS NOT NULL
      ORDER BY
        CASE m.status
          WHEN 'DISPUTED' THEN 0
          WHEN 'PENDING_CONFIRM' THEN 1
          WHEN 'SCHEDULED' THEN 2
          ELSE 3
        END ASC,
        CASE m.stage WHEN 'PLAYOFF' THEN 0 ELSE 1 END ASC,
        m.round_number DESC
      LIMIT ?
    `
    )
    .all(limit);

  const cache = new Map<string, Map<string, Match>>();
  const out: Array<Match & { tournamentSlug: string; tournamentTitle: string }> =
    [];

  for (const r of rows) {
    const tId = String(r.tournament_id);
    if (!cache.has(tId)) {
      cache.set(
        tId,
        new Map(getTournamentMatches(tId).map((tm) => [tm.id, tm]))
      );
    }
    const found = cache.get(tId)?.get(String(r.id));
    if (found) {
      out.push({
        ...found,
        tournamentSlug: String(r.tournament_slug),
        tournamentTitle: String(r.tournament_title),
      });
    }
  }
  return out;
}

export function registerPlayerForTournament(
  tournamentId: string,
  userId: string
): Participant {
  const db = getDb();
  return runInTransaction(db, () => {
    const tournament = getTournamentBySlugOrId(tournamentId);
    if (!tournament) {
      throw new Error('Турнір не знайдено.');
    }
    if (tournament.status !== 'REGISTRATION') {
      throw new Error('Реєстрацію на цей турнір вже закрито.');
    }

    const existing = db
      .prepare(
        'SELECT id FROM participants WHERE tournament_id = ? AND user_id = ?'
      )
      .get(tournament.id, userId);
    if (existing) {
      throw new Error('Ви вже зареєстровані у цьому турнірі.');
    }

    const countRow = db
      .prepare(
        'SELECT COUNT(*) AS cnt FROM participants WHERE tournament_id = ?'
      )
      .get(tournament.id) as { cnt: number };

    if (Number(countRow.cnt) >= tournament.maxPlayers) {
      throw new Error('Усі місця в турнірі вже зайняті.');
    }

    if (tournament.cupType === 'ANNUAL') {
      const userRow = db
        .prepare('SELECT qualified_annual, season_points FROM users WHERE id = ?')
        .get(userId) as
        | { qualified_annual: number; season_points: number }
        | undefined;
      // Дозволяємо пряму реєстрацію чемпіонам місяців або ТОП-32 рейтингу сезону (>= 120 очок)
      const leaderboard = getLeaderboard();
      const top32Ids = new Set(leaderboard.slice(0, 32).map((u) => u.id));
      const isEligible =
        Boolean(Number(userRow?.qualified_annual)) || top32Ids.has(userId);
      if (!isEligible) {
        throw new Error(
          'У Річний Гранд-Фінал (100 000 ₴) потрапляють Чемпіони Місячних Кубків та ТОП-32 гравці Всеукраїнського рейтингу.'
        );
      }
    }

    const id = uid('prt');
    const paymentStatus = tournament.entryFeeUah > 0 ? 'PAID' : 'FREE';
    db.prepare(
      `
      INSERT INTO participants (
        id, tournament_id, user_id, seed_pot, assigned_club_id, group_name, payment_status, registered_at
      ) VALUES (?, ?, ?, NULL, NULL, NULL, ?, ?)
    `
    ).run(id, tournament.id, userId, paymentStatus, new Date().toISOString());

    const all = getTournamentParticipants(tournament.id);
    const created = all.find((p) => p.userId === userId);
    if (!created) throw new Error('Помилка реєстрації учасника.');
    return created;
  });
}

export function fillTournamentWithDemoPlayers(tournamentId: string): number {
  const db = getDb();
  return runInTransaction(db, () => {
    const tournament = getTournamentBySlugOrId(tournamentId);
    if (!tournament) throw new Error('Турнір не знайдено.');
    if (tournament.status !== 'REGISTRATION') {
      throw new Error('Додавати гравців можна лише на етапі реєстрації.');
    }

    const existingParticipants = getTournamentParticipants(tournament.id);
    const registeredIds = new Set(existingParticipants.map((p) => p.userId));
    let needed = tournament.maxPlayers - existingParticipants.length;
    if (needed <= 0) return 0;

    const availablePlayers = db
      .prepare("SELECT id FROM users WHERE role = 'PLAYER' ORDER BY season_points DESC")
      .all()
      .map((r) => String(r.id))
      .filter((id) => !registeredIds.has(id));

    const now = new Date().toISOString();
    const insertPart = db.prepare(`
      INSERT INTO participants (
        id, tournament_id, user_id, seed_pot, assigned_club_id, group_name, payment_status, registered_at
      ) VALUES (?, ?, ?, NULL, NULL, NULL, ?, ?)
    `);

    let added = 0;
    const paymentStatus = tournament.entryFeeUah > 0 ? 'PAID' : 'FREE';

    for (const userId of availablePlayers) {
      if (needed <= 0) break;
      insertPart.run(uid('prt'), tournament.id, userId, paymentStatus, now);
      needed -= 1;
      added += 1;
    }

    // Якщо турнір на 32 гравці і потрібно створити додаткових українських гравців
    const extraNickPrefixes = [
      'Halych_10',
      'Azov_Press',
      'Desna_Pro',
      'Slobozhan_9',
      'Tavria_King',
      'Kremenchuk_FC',
      'BilaTserkva_7',
      'Zhytomyr_Ace',
      'Sumy_Sniper',
      'Kropyv_Star',
      'Khmel_Maestro',
      'Chernihiv_11',
      'Mariupol_ Pride',
      'KryvyiRih_FC',
      'Uman_Striker',
      'Mukachevo_Pro',
      'Brovary_Elite',
      'Irpin_Dynamo',
    ];
    const defaultPass = hashPassword('player123');
    const platforms: PlatformType[] = ['PS5', 'PC', 'XBOX'];
    const colors = ['#00F59B', '#38BDF8', '#F5C451', '#F43F5E', '#A78BFA'];

    let idx = 0;
    while (needed > 0) {
      const baseNick =
        extraNickPrefixes[idx % extraNickPrefixes.length].replace(/\s+/g, '') +
        `_${Math.floor(10 + Math.random() * 89)}`;
      const newUserId = uid('usr');
      const city = UKRAINIAN_CITIES[idx % UKRAINIAN_CITIES.length];
      const platform = platforms[idx % platforms.length];
      const color = colors[idx % colors.length];

      db.prepare(
        `
        INSERT INTO users (
          id, nickname, full_name, email, password_hash, city, platform, ea_id, telegram,
          role, season_points, wins, draws, losses, goals_for, goals_against,
          tournaments_won, qualified_annual, avatar_color, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PLAYER', ?, 3, 1, 4, 12, 14, 0, 0, ?, ?)
      `
      ).run(
        newUserId,
        baseNick,
        `Гравець ${baseNick}`,
        `${newUserId}@cyberliga.ua`,
        defaultPass,
        city,
        platform,
        baseNick,
        `@${baseNick.toLowerCase()}`,
        80 + (idx * 7) % 90,
        color,
        now
      );

      insertPart.run(uid('prt'), tournament.id, newUserId, paymentStatus, now);
      needed -= 1;
      added += 1;
      idx += 1;
    }

    return added;
  });
}

export function runClubDraft(tournamentId: string): Participant[] {
  const db = getDb();
  return runInTransaction(db, () => {
    const tournament = getTournamentBySlugOrId(tournamentId);
    if (!tournament) throw new Error('Турнір не знайдено.');
    if (tournament.gameMode !== 'KICKOFF_CLUB_DRAFT') {
      throw new Error(
        'Жеребкування клубів доступне лише для турнірів у режимі Kick-Off / Online Friendlies.'
      );
    }
    if (tournament.status === 'PLAYOFF' || tournament.status === 'COMPLETED') {
      throw new Error('Неможливо пережеребкувати клуби під час Плей-офф або після завершення турніру.');
    }

    const participants = getTournamentParticipants(tournament.id);
    if (participants.length < 4) {
      throw new Error('Для жеребкування клубів потрібно щонайменше 4 учасники.');
    }

    const pool = getClubsForPool(tournament.clubPool, participants.length);
    const shuffledClubs = shuffleCrypto(pool);

    const updateStmt = db.prepare(
      'UPDATE participants SET assigned_club_id = ? WHERE id = ?'
    );
    participants.forEach((p, idx) => {
      const club = shuffledClubs[idx % shuffledClubs.length];
      updateStmt.run(club.id, p.id);
    });

    if (tournament.status === 'REGISTRATION') {
      db.prepare("UPDATE tournaments SET status = 'CLUB_DRAW' WHERE id = ?").run(
        tournament.id
      );
    }

    return getTournamentParticipants(tournament.id);
  });
}

export function runGroupDraw(tournamentId: string): {
  participants: Participant[];
  matchesCreated: number;
} {
  const db = getDb();
  return runInTransaction(db, () => {
    const tournament = getTournamentBySlugOrId(tournamentId);
    if (!tournament) throw new Error('Турнір не знайдено.');
    if (tournament.status === 'PLAYOFF' || tournament.status === 'COMPLETED') {
      throw new Error('Турнір вже у стадії Плей-офф або завершений.');
    }

    let participants = getTournamentParticipants(tournament.id);
    if (participants.length < 4 || participants.length % 4 !== 0) {
      throw new Error(
        `Для групового етапу кількість учасників має бути кратною 4 (4, 8, 16 або 32). Зараз зареєстровано: ${participants.length}.`
      );
    }

    // Якщо режим Kick-Off і клуби ще не розіграні — автоматично проводимо драфт клубів!
    if (
      tournament.gameMode === 'KICKOFF_CLUB_DRAFT' &&
      participants.some((p) => !p.assignedClubId)
    ) {
      const pool = getClubsForPool(tournament.clubPool, participants.length);
      const shuffledClubs = shuffleCrypto(pool);
      const updClub = db.prepare(
        'UPDATE participants SET assigned_club_id = ? WHERE id = ?'
      );
      participants.forEach((p, idx) => {
        updClub.run(shuffledClubs[idx % shuffledClubs.length].id, p.id);
      });
      participants = getTournamentParticipants(tournament.id);
    }

    const numGroups = participants.length / 4;
    const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].slice(
      0,
      numGroups
    );

    // Сортуємо гравців за Всеукраїнським рейтингом для формування 4 кошиків посіву
    const sortedByRating = [...participants].sort(
      (a, b) => b.seasonPoints - a.seasonPoints
    );

    const updateParticipant = db.prepare(
      'UPDATE participants SET seed_pot = ?, group_name = ? WHERE id = ?'
    );

    const groupsMap: Record<string, Participant[]> = {};
    for (const g of groupLetters) groupsMap[g] = [];

    for (let pot = 1; pot <= 4; pot++) {
      const potSlice = sortedByRating.slice(
        (pot - 1) * numGroups,
        pot * numGroups
      );
      const shuffledPot = shuffleCrypto(potSlice);
      shuffledPot.forEach((player, gIdx) => {
        const gLetter = groupLetters[gIdx];
        updateParticipant.run(pot, gLetter, player.id);
        groupsMap[gLetter].push({ ...player, seedPot: pot, groupName: gLetter });
      });
    }

    // Видаляємо старі матчі турніру (якщо пережеребкування) і генеруємо календар Round-Robin (3 тури по 2 матчі в групі)
    db.prepare('DELETE FROM matches WHERE tournament_id = ?').run(tournament.id);

    const insertMatch = db.prepare(`
      INSERT INTO matches (
        id, tournament_id, stage, group_name, round_number, playoff_round, match_order,
        player1_id, player2_id, score1, score2, penalties1, penalties2, winner_id,
        status, submitted_by_id, proof_image_url, dispute_reason, dispute_image_url,
        admin_note, next_match_id, next_match_slot, loser_next_match_id, loser_next_match_slot, updated_at
      ) VALUES (?, ?, 'GROUP', ?, ?, NULL, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, 'SCHEDULED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?)
    `);

    const now = new Date().toISOString();
    let order = 1;
    let matchesCreated = 0;

    for (const gLetter of groupLetters) {
      const gp = groupsMap[gLetter]; // [pot1, pot2, pot3, pot4]
      const pairings: Array<[number, number, number]> = [
        [1, 0, 3], // Тур 1: Кошик 1 vs Кошик 4
        [1, 1, 2], // Тур 1: Кошик 2 vs Кошик 3
        [2, 0, 2], // Тур 2: Кошик 1 vs Кошик 3
        [2, 1, 3], // Тур 2: Кошик 2 vs Кошик 4
        [3, 0, 1], // Тур 3: Кошик 1 vs Кошик 2
        [3, 2, 3], // Тур 3: Кошик 3 vs Кошик 4
      ];

      for (const [roundNum, i1, i2] of pairings) {
        insertMatch.run(
          uid('m_grp'),
          tournament.id,
          gLetter,
          roundNum,
          order++,
          gp[i1].userId,
          gp[i2].userId,
          now
        );
        matchesCreated += 1;
      }
    }

    db.prepare("UPDATE tournaments SET status = 'GROUP_STAGE' WHERE id = ?").run(
      tournament.id
    );

    return {
      participants: getTournamentParticipants(tournament.id),
      matchesCreated,
    };
  });
}

export function simulateRemainingGroupMatches(tournamentId: string): number {
  const db = getDb();
  return runInTransaction(db, () => {
    const tournament = getTournamentBySlugOrId(tournamentId);
    if (!tournament) throw new Error('Турнір не знайдено.');
    if (tournament.status !== 'GROUP_STAGE') {
      throw new Error('Турнір має перебувати на стадії Групового етапу.');
    }

    const pendingGroupMatches = db
      .prepare(
        "SELECT id, player1_id, player2_id FROM matches WHERE tournament_id = ? AND stage = 'GROUP' AND status != 'COMPLETED'"
      )
      .all(tournament.id);

    const realisticScores: Array<[number, number]> = [
      [3, 1],
      [2, 1],
      [2, 0],
      [1, 1],
      [3, 2],
      [0, 2],
      [1, 2],
      [4, 1],
      [2, 2],
      [1, 0],
    ];

    const upd = db.prepare(`
      UPDATE matches
      SET score1 = ?, score2 = ?, winner_id = ?, status = 'COMPLETED', updated_at = ?
      WHERE id = ?
    `);

    const now = new Date().toISOString();
    let count = 0;
    for (const m of pendingGroupMatches) {
      const [s1, s2] =
        realisticScores[(count + Math.floor(Math.random() * realisticScores.length)) % realisticScores.length];
      const p1 = String(m.player1_id);
      const p2 = String(m.player2_id);
      const winner = s1 > s2 ? p1 : s2 > s1 ? p2 : null;
      upd.run(s1, s2, winner, now, String(m.id));
      applyMatchStatsDeltaToUsers(p1, p2, s1, s2, 1);
      count += 1;
    }

    return count;
  });
}

export function generatePlayoffBracket(tournamentId: string): Match[] {
  const db = getDb();
  return runInTransaction(db, () => {
    const tournament = getTournamentBySlugOrId(tournamentId);
    if (!tournament) throw new Error('Турнір не знайдено.');

    const standings = computeGroupStandings(tournament.id);
    const groupLetters = Object.keys(standings).sort();
    if (groupLetters.length < 1) {
      throw new Error('Спочатку проведіть груповий етап.');
    }

    // Видаляємо попередні матчі плей-офф якщо перегенеруємо
    db.prepare(
      "DELETE FROM matches WHERE tournament_id = ? AND stage = 'PLAYOFF'"
    ).run(tournament.id);

    const now = new Date().toISOString();
    const insertPlayoffMatch = db.prepare(`
      INSERT INTO matches (
        id, tournament_id, stage, group_name, round_number, playoff_round, match_order,
        player1_id, player2_id, score1, score2, penalties1, penalties2, winner_id,
        status, next_match_id, next_match_slot, loser_next_match_id, loser_next_match_slot, updated_at
      ) VALUES (?, ?, 'PLAYOFF', NULL, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, 'SCHEDULED', ?, ?, ?, ?, ?)
    `);

    const first = (g: string) => standings[g]?.[0]?.userId ?? null;
    const second = (g: string) => standings[g]?.[1]?.userId ?? null;
    const third = (g: string) => standings[g]?.[2]?.userId ?? null;
    const fourth = (g: string) => standings[g]?.[3]?.userId ?? null;

    if (groupLetters.length === 1) {
      // 4 гравці -> 1 група (A) -> Фінал (1A vs 2A) + Матч за 3 місце (3A vs 4A)
      const finalId = uid('m_fin');
      const thirdId = uid('m_3rd');
      insertPlayoffMatch.run(
        finalId,
        tournament.id,
        1,
        'FINAL',
        1,
        first('A'),
        second('A'),
        null,
        null,
        null,
        null,
        now
      );
      insertPlayoffMatch.run(
        thirdId,
        tournament.id,
        1,
        'THIRD',
        1,
        third('A'),
        fourth('A'),
        null,
        null,
        null,
        null,
        now
      );
    } else if (groupLetters.length === 2) {
      // 8 гравців -> 2 групи (A, B) -> Півфінали + Матч за 3 місце + Фінал
      const finalId = uid('m_fin');
      const thirdId = uid('m_3rd');
      const sf1Id = uid('m_sf');
      const sf2Id = uid('m_sf');

      insertPlayoffMatch.run(
        finalId,
        tournament.id,
        2,
        'FINAL',
        1,
        null,
        null,
        null,
        null,
        null,
        null,
        now
      );
      insertPlayoffMatch.run(
        thirdId,
        tournament.id,
        2,
        'THIRD',
        1,
        null,
        null,
        null,
        null,
        null,
        null,
        now
      );
      insertPlayoffMatch.run(
        sf1Id,
        tournament.id,
        1,
        'SF',
        1,
        first('A'),
        second('B'),
        finalId,
        1,
        thirdId,
        1,
        now
      );
      insertPlayoffMatch.run(
        sf2Id,
        tournament.id,
        1,
        'SF',
        2,
        first('B'),
        second('A'),
        finalId,
        2,
        thirdId,
        2,
        now
      );
    } else if (groupLetters.length === 4) {
      // 16 гравців -> 4 групи (A, B, C, D) -> 1/4 фіналу -> 1/2 фіналу -> 3 місце + Фінал
      const finalId = uid('m_fin');
      const thirdId = uid('m_3rd');
      const sf1Id = uid('m_sf');
      const sf2Id = uid('m_sf');

      insertPlayoffMatch.run(
        finalId,
        tournament.id,
        3,
        'FINAL',
        1,
        null,
        null,
        null,
        null,
        null,
        null,
        now
      );
      insertPlayoffMatch.run(
        thirdId,
        tournament.id,
        3,
        'THIRD',
        1,
        null,
        null,
        null,
        null,
        null,
        null,
        now
      );
      insertPlayoffMatch.run(
        sf1Id,
        tournament.id,
        2,
        'SF',
        1,
        null,
        null,
        finalId,
        1,
        thirdId,
        1,
        now
      );
      insertPlayoffMatch.run(
        sf2Id,
        tournament.id,
        2,
        'SF',
        2,
        null,
        null,
        finalId,
        2,
        thirdId,
        2,
        now
      );

      // Крос-посів (одногрупники у різних половинах сітки!)
      const qfPairs: Array<[string | null, string | null, string, 1 | 2]> = [
        [first('A'), second('C'), sf1Id, 1],
        [first('D'), second('B'), sf1Id, 2],
        [first('B'), second('D'), sf2Id, 1],
        [first('C'), second('A'), sf2Id, 2],
      ];

      qfPairs.forEach(([p1, p2, nextId, slot], i) => {
        insertPlayoffMatch.run(
          uid('m_qf'),
          tournament.id,
          1,
          'QF',
          i + 1,
          p1,
          p2,
          nextId,
          slot,
          null,
          null,
          now
        );
      });
    } else if (groupLetters.length === 8) {
      // 32 гравці -> 8 груп (A..H) -> 1/8 фіналу -> 1/4 -> 1/2 -> 3 місце + Фінал
      const finalId = uid('m_fin');
      const thirdId = uid('m_3rd');
      const sf1Id = uid('m_sf');
      const sf2Id = uid('m_sf');
      const qfIds = [uid('m_qf'), uid('m_qf'), uid('m_qf'), uid('m_qf')];

      insertPlayoffMatch.run(
        finalId,
        tournament.id,
        4,
        'FINAL',
        1,
        null,
        null,
        null,
        null,
        null,
        null,
        now
      );
      insertPlayoffMatch.run(
        thirdId,
        tournament.id,
        4,
        'THIRD',
        1,
        null,
        null,
        null,
        null,
        null,
        null,
        now
      );
      insertPlayoffMatch.run(
        sf1Id,
        tournament.id,
        3,
        'SF',
        1,
        null,
        null,
        finalId,
        1,
        thirdId,
        1,
        now
      );
      insertPlayoffMatch.run(
        sf2Id,
        tournament.id,
        3,
        'SF',
        2,
        null,
        null,
        finalId,
        2,
        thirdId,
        2,
        now
      );

      qfIds.forEach((qfId, idx) => {
        const targetSf = idx < 2 ? sf1Id : sf2Id;
        const slot = (idx % 2 === 0 ? 1 : 2) as 1 | 2;
        insertPlayoffMatch.run(
          qfId,
          tournament.id,
          2,
          'QF',
          idx + 1,
          null,
          null,
          targetSf,
          slot,
          null,
          null,
          now
        );
      });

      const r16Pairs: Array<[string | null, string | null, string, 1 | 2]> = [
        [first('A'), second('C'), qfIds[0], 1],
        [first('E'), second('G'), qfIds[0], 2],
        [first('D'), second('B'), qfIds[1], 1],
        [first('H'), second('F'), qfIds[1], 2],
        [first('B'), second('D'), qfIds[2], 1],
        [first('F'), second('H'), qfIds[2], 2],
        [first('C'), second('A'), qfIds[3], 1],
        [first('G'), second('E'), qfIds[3], 2],
      ];

      r16Pairs.forEach(([p1, p2, nextId, slot], idx) => {
        insertPlayoffMatch.run(
          uid('m_r16'),
          tournament.id,
          1,
          'R16',
          idx + 1,
          p1,
          p2,
          nextId,
          slot,
          null,
          null,
          now
        );
      });
    } else {
      throw new Error('Підтримується сітка на 2, 4 або 8 груп.');
    }

    db.prepare("UPDATE tournaments SET status = 'PLAYOFF' WHERE id = ?").run(
      tournament.id
    );

    return getTournamentMatches(tournament.id).filter(
      (m) => m.stage === 'PLAYOFF'
    );
  });
}

function advancePlayoffWinnerAndLoser(
  matchRow: Record<string, unknown>,
  winnerId: string | null,
  loserId: string | null
) {
  const db = getDb();
  const now = new Date().toISOString();

  if (winnerId && matchRow.next_match_id && matchRow.next_match_slot) {
    const slotCol =
      Number(matchRow.next_match_slot) === 1 ? 'player1_id' : 'player2_id';
    db.prepare(
      `UPDATE matches SET ${slotCol} = ?, updated_at = ? WHERE id = ?`
    ).run(winnerId, now, String(matchRow.next_match_id));
  }

  if (
    loserId &&
    matchRow.loser_next_match_id &&
    matchRow.loser_next_match_slot
  ) {
    const loserCol =
      Number(matchRow.loser_next_match_slot) === 1
        ? 'player1_id'
        : 'player2_id';
    db.prepare(
      `UPDATE matches SET ${loserCol} = ?, updated_at = ? WHERE id = ?`
    ).run(loserId, now, String(matchRow.loser_next_match_id));
  }
}

function applyMatchStatsDeltaToUsers(
  p1Id: string,
  p2Id: string,
  score1: number,
  score2: number,
  direction: 1 | -1
) {
  const db = getDb();
  const p1W = (score1 > score2 ? 1 : 0) * direction;
  const p1D = (score1 === score2 ? 1 : 0) * direction;
  const p1L = (score1 < score2 ? 1 : 0) * direction;

  const p2W = (score2 > score1 ? 1 : 0) * direction;
  const p2D = (score1 === score2 ? 1 : 0) * direction;
  const p2L = (score2 < score1 ? 1 : 0) * direction;

  const updUser = db.prepare(`
    UPDATE users
    SET wins = MAX(0, wins + ?),
        draws = MAX(0, draws + ?),
        losses = MAX(0, losses + ?),
        goals_for = MAX(0, goals_for + ?),
        goals_against = MAX(0, goals_against + ?)
    WHERE id = ?
  `);

  updUser.run(p1W, p1D, p1L, score1 * direction, score2 * direction, p1Id);
  updUser.run(p2W, p2D, p2L, score2 * direction, score1 * direction, p2Id);
}

function computeWinnerAndLoser(
  stage: string,
  p1Id: string,
  p2Id: string,
  score1: number,
  score2: number,
  pen1: number | null,
  pen2: number | null
): { winnerId: string | null; loserId: string | null } {
  if (score1 > score2) return { winnerId: p1Id, loserId: p2Id };
  if (score2 > score1) return { winnerId: p2Id, loserId: p1Id };

  if (stage === 'PLAYOFF') {
    if (pen1 === null || pen2 === null || pen1 === pen2) {
      throw new Error(
        'У матчі Плей-офф за нічийного рахунку необхідно вказати результат серії пенальті.'
      );
    }
    return pen1 > pen2
      ? { winnerId: p1Id, loserId: p2Id }
      : { winnerId: p2Id, loserId: p1Id };
  }

  return { winnerId: null, loserId: null };
}

export function submitMatchResult(params: {
  matchId: string;
  actor: User;
  score1: number;
  score2: number;
  penalties1?: number | null;
  penalties2?: number | null;
  proofImageUrl?: string | null;
  adminNote?: string | null;
  instantConfirm?: boolean;
}) {
  const db = getDb();
  const {
    matchId,
    actor,
    score1,
    score2,
    penalties1 = null,
    penalties2 = null,
    proofImageUrl = null,
    adminNote = null,
    instantConfirm = false,
  } = params;

  if (
    !Number.isInteger(score1) ||
    !Number.isInteger(score2) ||
    score1 < 0 ||
    score2 < 0 ||
    score1 > 30 ||
    score2 > 30
  ) {
    throw new Error('Некоректний рахунок матчу (допустимо від 0 до 30).');
  }

  return runInTransaction(db, () => {
    const row = db
      .prepare('SELECT * FROM matches WHERE id = ?')
      .get(matchId);
    if (!row) throw new Error('Матч не знайдено.');

    const p1Id = row.player1_id ? String(row.player1_id) : null;
    const p2Id = row.player2_id ? String(row.player2_id) : null;
    if (!p1Id || !p2Id) {
      throw new Error('Обидва суперники матчу ще не визначені.');
    }

    const isAdmin = actor.role === 'ADMIN';
    const isPlayerInMatch = actor.id === p1Id || actor.id === p2Id;
    if (!isAdmin && !isPlayerInMatch) {
      throw new Error('Ви не є учасником цього матчу або суддею турніру.');
    }

    const stage = String(row.stage);
    const { winnerId, loserId } = computeWinnerAndLoser(
      stage,
      p1Id,
      p2Id,
      score1,
      score2,
      penalties1,
      penalties2
    );

    const now = new Date().toISOString();
    const shouldComplete = isAdmin || instantConfirm;
    const wasCompleted =
      String(row.status) === 'COMPLETED' &&
      row.score1 !== null &&
      row.score2 !== null;

    if (wasCompleted) {
      applyMatchStatsDeltaToUsers(
        p1Id,
        p2Id,
        Number(row.score1),
        Number(row.score2),
        -1
      );
    }

    if (shouldComplete) {
      db.prepare(
        `
        UPDATE matches
        SET score1 = ?, score2 = ?, penalties1 = ?, penalties2 = ?,
            winner_id = ?, status = 'COMPLETED', submitted_by_id = ?,
            proof_image_url = COALESCE(?, proof_image_url),
            admin_note = COALESCE(?, admin_note),
            dispute_reason = NULL,
            updated_at = ?
        WHERE id = ?
      `
      ).run(
        score1,
        score2,
        penalties1,
        penalties2,
        winnerId,
        actor.id,
        proofImageUrl,
        adminNote ?? (isAdmin ? 'Затверджено головним суддею' : null),
        now,
        matchId
      );

      applyMatchStatsDeltaToUsers(p1Id, p2Id, score1, score2, 1);

      if (stage === 'PLAYOFF') {
        advancePlayoffWinnerAndLoser(row, winnerId, loserId);
      }
    } else {
      db.prepare(
        `
        UPDATE matches
        SET score1 = ?, score2 = ?, penalties1 = ?, penalties2 = ?,
            winner_id = NULL, status = 'PENDING_CONFIRM', submitted_by_id = ?,
            proof_image_url = COALESCE(?, proof_image_url),
            updated_at = ?
        WHERE id = ?
      `
      ).run(
        score1,
        score2,
        penalties1,
        penalties2,
        actor.id,
        proofImageUrl,
        now,
        matchId
      );
    }
  });
}

export function confirmPendingMatch(matchId: string, actor: User) {
  const db = getDb();
  return runInTransaction(db, () => {
    const row = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId);
    if (!row) throw new Error('Матч не знайдено.');
    if (
      String(row.status) !== 'PENDING_CONFIRM' &&
      !(actor.role === 'ADMIN' && String(row.status) === 'DISPUTED')
    ) {
      throw new Error('Цей матч не очікує підтвердження.');
    }

    const p1Id = String(row.player1_id);
    const p2Id = String(row.player2_id);
    const submittedBy = row.submitted_by_id ? String(row.submitted_by_id) : null;

    if (actor.role !== 'ADMIN') {
      if (actor.id !== p1Id && actor.id !== p2Id) {
        throw new Error('Підтвердити рахунок може лише учасник матчу або суддя.');
      }
      if (actor.id === submittedBy) {
        throw new Error('Очікується підтвердження від вашого суперника або судді.');
      }
    }

    const s1 = Number(row.score1);
    const s2 = Number(row.score2);
    const pen1 = row.penalties1 !== null ? Number(row.penalties1) : null;
    const pen2 = row.penalties2 !== null ? Number(row.penalties2) : null;
    const stage = String(row.stage);

    const { winnerId, loserId } = computeWinnerAndLoser(
      stage,
      p1Id,
      p2Id,
      s1,
      s2,
      pen1,
      pen2
    );

    const now = new Date().toISOString();
    db.prepare(
      `
      UPDATE matches
      SET winner_id = ?, status = 'COMPLETED',
          admin_note = ?, dispute_reason = NULL, updated_at = ?
      WHERE id = ?
    `
    ).run(
      winnerId,
      actor.role === 'ADMIN'
        ? 'Підтверджено арбітром турніру'
        : 'Підтверджено суперником',
      now,
      matchId
    );

    applyMatchStatsDeltaToUsers(p1Id, p2Id, s1, s2, 1);

    if (stage === 'PLAYOFF') {
      advancePlayoffWinnerAndLoser(row, winnerId, loserId);
    }
  });
}

export function disputeMatch(params: {
  matchId: string;
  actor: User;
  reason: string;
  disputeImageUrl?: string | null;
}) {
  const db = getDb();
  const { matchId, actor, reason, disputeImageUrl = null } = params;
  if (!reason.trim()) {
    throw new Error('Опишіть причину спору для головного судді.');
  }

  return runInTransaction(db, () => {
    const row = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId);
    if (!row) throw new Error('Матч не знайдено.');

    const p1Id = row.player1_id ? String(row.player1_id) : null;
    const p2Id = row.player2_id ? String(row.player2_id) : null;
    if (actor.role !== 'ADMIN' && actor.id !== p1Id && actor.id !== p2Id) {
      throw new Error('Відкрити спір може лише учасник матчу.');
    }

    db.prepare(
      `
      UPDATE matches
      SET status = 'DISPUTED',
          dispute_reason = ?,
          dispute_image_url = COALESCE(?, dispute_image_url),
          updated_at = ?
      WHERE id = ?
    `
    ).run(reason.trim(), disputeImageUrl, new Date().toISOString(), matchId);
  });
}

export function createTournament(input: {
  title: string;
  subtitle: string;
  cupType: CupType;
  gameMode: GameMode;
  clubPool: ClubPoolType;
  equal95Ovr: boolean;
  prizePoolUah: number;
  entryFeeUah: number;
  maxPlayers: 8 | 16 | 32;
  monthLabel: string;
  startDate: string;
  rulesNote: string;
}): Tournament {
  const db = getDb();

  if (input.entryFeeUah < 0 || input.entryFeeUah > EA_MAX_ENTRY_FEE_UAH) {
    throw new Error(
      `Згідно з EA Community Tournament Guidelines стартовий внесок не може перевищувати $${EA_MAX_ENTRY_FEE_USD} (~${EA_MAX_ENTRY_FEE_UAH} ₴).`
    );
  }

  const seasonYear = Number(input.startDate.slice(0, 4)) || 2026;
  const compliance = getEaComplianceSummary(seasonYear);
  if (compliance.totalPrizeUah + input.prizePoolUah > EA_ANNUAL_PRIZE_CAP_UAH) {
    throw new Error(
      `Перевищено річний безліцензійний ліміт EA ($10,000 / ${EA_ANNUAL_PRIZE_CAP_UAH.toLocaleString('uk-UA')} ₴ на рік)! Доступний залишок на ${seasonYear} рік: ${compliance.remainingUah.toLocaleString('uk-UA')} ₴.`
    );
  }

  const baseSlug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '');
  const slug = `${baseSlug || 'cup'}-${Math.floor(100 + Math.random() * 899)}`;
  const id = uid('trn');
  const now = new Date().toISOString();

  const defaultPrizes =
    input.cupType === 'ANNUAL'
      ? ANNUAL_DEFAULT_PRIZES
      : MONTHLY_DEFAULT_PRIZES;

  // Масштабуємо суми призів пропорційно вказаному призовому фонду
  const defaultSum = defaultPrizes.reduce((acc, p) => acc + p.amountUah, 0) || 1;
  const ratio = input.prizePoolUah / defaultSum;
  const scaledPrizes: PrizeTier[] = defaultPrizes.map((p) => ({
    ...p,
    amountUah: Math.round((p.amountUah * ratio) / 50) * 50,
  }));

  db.prepare(
    `
    INSERT INTO tournaments (
      id, slug, title, subtitle, cup_type, game_mode, club_pool, equal_95_ovr,
      prize_pool_uah, entry_fee_uah, max_players, group_size, status,
      season_year, month_label, start_date, rules_note, prize_breakdown_json,
      champion_user_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4, 'REGISTRATION', ?, ?, ?, ?, ?, NULL, ?)
  `
  ).run(
    id,
    slug,
    input.title.trim(),
    input.subtitle.trim() || 'Всеукраїнський турнір 1 на 1 з EA SPORTS FC 27',
    input.cupType,
    input.gameMode,
    input.gameMode === 'ULTIMATE_TEAM' ? 'NONE' : input.clubPool,
    input.equal95Ovr ? 1 : 0,
    input.prizePoolUah,
    input.entryFeeUah,
    input.maxPlayers,
    seasonYear,
    input.monthLabel.trim() || 'Сезон 2026',
    input.startDate,
    input.rulesNote.trim() ||
      'Матчі 1v1 Cross-Play (PS5 / PC / Xbox Series X|S), тайм 6 хвилин.',
    JSON.stringify(scaledPrizes),
    now
  );

  const created = getTournamentBySlugOrId(id);
  if (!created) throw new Error('Не вдалося створити турнір.');
  return created;
}

export function finalizeTournamentAndAwardPoints(tournamentId: string): Tournament {
  const db = getDb();
  return runInTransaction(db, () => {
    const tournament = getTournamentBySlugOrId(tournamentId);
    if (!tournament) throw new Error('Турнір не знайдено.');
    if (tournament.status === 'COMPLETED') {
      throw new Error('Цей турнір вже завершено, очки вже нараховані.');
    }

    const matches = getTournamentMatches(tournament.id);
    const finalMatch = matches.find((m) => m.playoffRound === 'FINAL');
    if (!finalMatch || finalMatch.status !== 'COMPLETED' || !finalMatch.winnerId) {
      throw new Error(
        'Для завершення турніру необхідно спочатку зіграти та підтвердити ФІНАЛ.'
      );
    }

    const championId = finalMatch.winnerId;
    const runnerUpId =
      finalMatch.player1Id === championId
        ? finalMatch.player2Id
        : finalMatch.player1Id;

    const thirdMatch = matches.find((m) => m.playoffRound === 'THIRD');
    const thirdId =
      thirdMatch?.status === 'COMPLETED' ? thirdMatch.winnerId : null;
    const fourthId =
      thirdMatch?.status === 'COMPLETED' && thirdId
        ? thirdMatch.player1Id === thirdId
          ? thirdMatch.player2Id
          : thirdMatch.player1Id
        : null;

    const isAnnual = tournament.cupType === 'ANNUAL';
    const pointsByUser = new Map<string, number>();
    const participants = getTournamentParticipants(tournament.id);

    // Базові очки за участь у груповому етапі
    for (const p of participants) {
      pointsByUser.set(p.userId, isAnnual ? 80 : 25);
    }

    // Очки за вихід у 1/8 та 1/4 фіналу
    for (const m of matches) {
      if (m.playoffRound === 'R16') {
        if (m.player1Id) pointsByUser.set(m.player1Id, isAnnual ? 140 : 45);
        if (m.player2Id) pointsByUser.set(m.player2Id, isAnnual ? 140 : 45);
      }
      if (m.playoffRound === 'QF') {
        if (m.player1Id) pointsByUser.set(m.player1Id, isAnnual ? 200 : 75);
        if (m.player2Id) pointsByUser.set(m.player2Id, isAnnual ? 200 : 75);
      }
    }

    if (fourthId) pointsByUser.set(fourthId, isAnnual ? 350 : 110);
    if (thirdId) pointsByUser.set(thirdId, isAnnual ? 500 : 135);
    if (runnerUpId) pointsByUser.set(runnerUpId, isAnnual ? 700 : 180);
    pointsByUser.set(championId, isAnnual ? 1000 : 250);

    const updPoints = db.prepare(
      'UPDATE users SET season_points = season_points + ? WHERE id = ?'
    );
    for (const [uId, pts] of pointsByUser.entries()) {
      updPoints.run(pts, uId);
    }

    // Чемпіон отримує титул, а за Місячний кубок — пряму путівку в Річний Кубок 100 000 ₴!
    db.prepare(
      `
      UPDATE users
      SET tournaments_won = tournaments_won + 1,
          qualified_annual = CASE WHEN ? = 'MONTHLY' THEN 1 ELSE qualified_annual END
      WHERE id = ?
    `
    ).run(tournament.cupType, championId);

    // Автоматично додаємо чемпіона місяця у відкритий Річний Гранд-Фінал, якщо він ще не в списку
    if (tournament.cupType === 'MONTHLY') {
      const annualCup = db
        .prepare(
          "SELECT id, max_players FROM tournaments WHERE cup_type = 'ANNUAL' AND status = 'REGISTRATION' ORDER BY created_at DESC LIMIT 1"
        )
        .get() as { id: string; max_players: number } | undefined;

      if (annualCup) {
        const alreadyInAnnual = db
          .prepare(
            'SELECT id FROM participants WHERE tournament_id = ? AND user_id = ?'
          )
          .get(annualCup.id, championId);
        const currentCnt = db
          .prepare(
            'SELECT COUNT(*) AS cnt FROM participants WHERE tournament_id = ?'
          )
          .get(annualCup.id) as { cnt: number };

        if (!alreadyInAnnual && Number(currentCnt.cnt) < Number(annualCup.max_players)) {
          db.prepare(
            `
            INSERT INTO participants (
              id, tournament_id, user_id, seed_pot, assigned_club_id, group_name, payment_status, registered_at
            ) VALUES (?, ?, ?, 1, NULL, NULL, 'FREE', ?)
          `
          ).run(uid('prt'), annualCup.id, championId, new Date().toISOString());
        }
      }
    }

    db.prepare(
      "UPDATE tournaments SET status = 'COMPLETED', champion_user_id = ? WHERE id = ?"
    ).run(championId, tournament.id);

    const updated = getTournamentBySlugOrId(tournament.id);
    if (!updated) throw new Error('Помилка оновлення статусу турніру.');
    return updated;
  });
}

export function getPlayerProfileByNicknameOrId(
  nicknameOrId: string
): PlayerProfileData | null {
  const db = getDb();
  const decoded = decodeURIComponent(nicknameOrId).trim();
  const row = db
    .prepare(
      'SELECT * FROM users WHERE LOWER(nickname) = LOWER(?) OR id = ? LIMIT 1'
    )
    .get(decoded, decoded);
  if (!row) return null;

  const user = mapUserRow(row);
  const leaderboard = getLeaderboard();
  const rankIdx = leaderboard.findIndex((u) => u.id === user.id);
  const nationalRank = rankIdx >= 0 ? rankIdx + 1 : leaderboard.length + 1;

  const partRows = db
    .prepare(
      `
      SELECT
        p.id AS participant_id,
        p.seed_pot,
        p.assigned_club_id,
        p.group_name,
        t.id AS tournament_id,
        t.slug AS tournament_slug,
        t.title AS tournament_title,
        t.subtitle AS tournament_subtitle,
        t.cup_type,
        t.game_mode,
        t.status,
        t.prize_pool_uah,
        t.month_label,
        t.start_date,
        t.champion_user_id
      FROM participants p
      JOIN tournaments t ON t.id = p.tournament_id
      WHERE p.user_id = ?
      ORDER BY t.start_date DESC
    `
    )
    .all(user.id);

  const participations: PlayerTournamentParticipation[] = partRows.map((r) => ({
    participantId: String(r.participant_id),
    tournamentId: String(r.tournament_id),
    tournamentSlug: String(r.tournament_slug),
    tournamentTitle: String(r.tournament_title),
    tournamentSubtitle: String(r.tournament_subtitle),
    cupType: String(r.cup_type) as CupType,
    gameMode: String(r.game_mode) as GameMode,
    status: String(r.status) as TournamentStatus,
    prizePoolUah: Number(r.prize_pool_uah),
    monthLabel: String(r.month_label),
    startDate: String(r.start_date),
    seedPot: r.seed_pot !== null ? Number(r.seed_pot) : null,
    groupName: r.group_name ? String(r.group_name) : null,
    club: getClubById(r.assigned_club_id ? String(r.assigned_club_id) : null),
    isChampion:
      r.champion_user_id !== null && String(r.champion_user_id) === user.id,
  }));

  const matchRows = db
    .prepare(
      `
      SELECT m.id, m.tournament_id, t.title AS tournament_title, t.slug AS tournament_slug
      FROM matches m
      JOIN tournaments t ON t.id = m.tournament_id
      WHERE m.player1_id = ? OR m.player2_id = ?
      ORDER BY
        CASE m.stage WHEN 'PLAYOFF' THEN 0 ELSE 1 END ASC,
        m.round_number DESC,
        m.match_order ASC
    `
    )
    .all(user.id, user.id);

  const cachedByTournament = new Map<string, Map<string, Match>>();
  const matches: Match[] = [];

  for (const mr of matchRows) {
    const tId = String(mr.tournament_id);
    if (!cachedByTournament.has(tId)) {
      cachedByTournament.set(
        tId,
        new Map(getTournamentMatches(tId).map((tm) => [tm.id, tm]))
      );
    }
    const hydrated = cachedByTournament.get(tId)?.get(String(mr.id));
    if (hydrated) {
      matches.push({
        ...hydrated,
        tournamentTitle: String(mr.tournament_title),
        tournamentSlug: String(mr.tournament_slug),
      });
    }
  }

  return {
    user,
    nationalRank,
    totalRankedPlayers: leaderboard.length,
    participations,
    matches,
  };
}

export function getActiveMatchForUser(
  userId: string
): (Match & { tournamentSlug: string; tournamentTitle: string }) | null {
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT m.id, m.tournament_id, t.slug AS tournament_slug, t.title AS tournament_title
      FROM matches m
      JOIN tournaments t ON t.id = m.tournament_id
      WHERE (m.player1_id = ? OR m.player2_id = ?)
        AND m.player1_id IS NOT NULL
        AND m.player2_id IS NOT NULL
        AND m.status != 'COMPLETED'
      ORDER BY
        CASE m.status
          WHEN 'DISPUTED' THEN 0
          WHEN 'PENDING_CONFIRM' THEN 1
          WHEN 'SCHEDULED' THEN 2
          ELSE 3
        END ASC,
        CASE m.stage WHEN 'PLAYOFF' THEN 0 ELSE 1 END ASC,
        m.round_number ASC,
        m.match_order ASC
      LIMIT 1
    `
    )
    .get(userId, userId);

  if (!row) return null;
  const tMatches = getTournamentMatches(String(row.tournament_id));
  const found = tMatches.find((tm) => tm.id === String(row.id));
  if (!found) return null;
  return {
    ...found,
    tournamentSlug: String(row.tournament_slug),
    tournamentTitle: String(row.tournament_title),
  };
}

export function updateUserProfile(
  targetUserId: string,
  input: {
    fullName?: string;
    city?: string;
    platform?: PlatformType;
    eaId?: string;
    telegram?: string;
    payoutCard?: string;
    avatarColor?: string;
    avatarUrl?: string;
    newPassword?: string;
  }
): User {
  const db = getDb();
  return runInTransaction(db, () => {
    const existing = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(targetUserId);
    if (!existing) {
      throw new Error('Профіль гравця не знайдено.');
    }

    const fullName =
      input.fullName !== undefined
        ? input.fullName.trim() || String(existing.nickname)
        : String(existing.full_name);
    const city =
      input.city !== undefined && input.city.trim()
        ? input.city.trim()
        : String(existing.city);
    const platform: PlatformType =
      input.platform && ['PS5', 'PC', 'XBOX'].includes(input.platform)
        ? input.platform
        : (String(existing.platform) as PlatformType);
    const eaId =
      input.eaId !== undefined ? input.eaId.trim() : String(existing.ea_id);
    if (!eaId) {
      throw new Error('EA ID не може бути порожнім.');
    }

    let telegram =
      input.telegram !== undefined
        ? input.telegram.trim()
        : String(existing.telegram);
    if (!telegram) {
      telegram = `@${String(existing.nickname).toLowerCase()}`;
    } else if (!telegram.startsWith('@')) {
      telegram = `@${telegram}`;
    }

    const payoutCard =
      input.payoutCard !== undefined
        ? input.payoutCard.trim()
        : String(existing.payout_card || '');
    const avatarColor =
      input.avatarColor !== undefined && input.avatarColor.trim()
        ? input.avatarColor.trim()
        : String(existing.avatar_color);
    const avatarUrl =
      input.avatarUrl !== undefined
        ? input.avatarUrl.trim()
        : String(existing.avatar_url || '');

    if (input.newPassword && input.newPassword.trim()) {
      if (input.newPassword.trim().length < 5) {
        throw new Error('Новий пароль має містити щонайменше 5 символів.');
      }
      db.prepare(
        `
        UPDATE users
        SET full_name = ?, city = ?, platform = ?, ea_id = ?, telegram = ?,
            payout_card = ?, avatar_color = ?, avatar_url = ?, password_hash = ?
        WHERE id = ?
      `
      ).run(
        fullName,
        city,
        platform,
        eaId,
        telegram,
        payoutCard,
        avatarColor,
        avatarUrl,
        hashPassword(input.newPassword.trim()),
        targetUserId
      );
    } else {
      db.prepare(
        `
        UPDATE users
        SET full_name = ?, city = ?, platform = ?, ea_id = ?, telegram = ?,
            payout_card = ?, avatar_color = ?, avatar_url = ?
        WHERE id = ?
      `
      ).run(
        fullName,
        city,
        platform,
        eaId,
        telegram,
        payoutCard,
        avatarColor,
        avatarUrl,
        targetUserId
      );
    }

    const updated = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(targetUserId)!;
    return mapUserRow(updated);
  });
}

export function unregisterPlayerFromTournament(
  tournamentId: string,
  targetUserId: string,
  actor: User
): void {
  const db = getDb();
  runInTransaction(db, () => {
    const tournament = getTournamentBySlugOrId(tournamentId);
    if (!tournament) throw new Error('Турнір не знайдено.');

    const isAdmin = actor.role === 'ADMIN';
    const isSelf = actor.id === targetUserId;
    if (!isAdmin && !isSelf) {
      throw new Error('Ви можете скасувати лише власну заявку.');
    }

    if (
      tournament.status !== 'REGISTRATION' &&
      !(isAdmin && tournament.status === 'CLUB_DRAW')
    ) {
      throw new Error(
        'Скасування участі можливе лише до початку групового етапу.'
      );
    }

    const res = db
      .prepare(
        'DELETE FROM participants WHERE tournament_id = ? AND user_id = ?'
      )
      .run(tournament.id, targetUserId);
    if (Number(res.changes) === 0) {
      throw new Error('Учасника не знайдено у списку цього турніру.');
    }
  });
}

export function updateTournamentDetails(
  tournamentId: string,
  input: {
    title: string;
    subtitle: string;
    prizePoolUah: number;
    entryFeeUah: number;
    maxPlayers: 8 | 16 | 32;
    monthLabel: string;
    startDate: string;
    rulesNote: string;
    clubPool?: ClubPoolType;
    equal95Ovr?: boolean;
  }
): Tournament {
  const db = getDb();
  return runInTransaction(db, () => {
    const existing = getTournamentBySlugOrId(tournamentId);
    if (!existing) throw new Error('Турнір не знайдено.');

    if (input.entryFeeUah < 0 || input.entryFeeUah > EA_MAX_ENTRY_FEE_UAH) {
      throw new Error(
        `Стартовий внесок не може перевищувати ${EA_MAX_ENTRY_FEE_UAH} ₴.`
      );
    }

    const defaultPrizes =
      existing.cupType === 'ANNUAL'
        ? ANNUAL_DEFAULT_PRIZES
        : MONTHLY_DEFAULT_PRIZES;
    const defaultSum =
      defaultPrizes.reduce((acc, p) => acc + p.amountUah, 0) || 1;
    const ratio = input.prizePoolUah / defaultSum;
    const scaledPrizes: PrizeTier[] = defaultPrizes.map((p) => ({
      ...p,
      amountUah: Math.round((p.amountUah * ratio) / 50) * 50,
    }));

    db.prepare(
      `
      UPDATE tournaments
      SET title = ?, subtitle = ?, prize_pool_uah = ?, entry_fee_uah = ?,
          max_players = ?, month_label = ?, start_date = ?, rules_note = ?,
          club_pool = ?, equal_95_ovr = ?, prize_breakdown_json = ?
      WHERE id = ?
    `
    ).run(
      input.title.trim() || existing.title,
      input.subtitle.trim() || existing.subtitle,
      input.prizePoolUah,
      input.entryFeeUah,
      input.maxPlayers,
      input.monthLabel.trim() || existing.monthLabel,
      input.startDate || existing.startDate,
      input.rulesNote.trim() || existing.rulesNote,
      input.clubPool ?? existing.clubPool,
      input.equal95Ovr !== undefined
        ? input.equal95Ovr
          ? 1
          : 0
        : existing.equal95Ovr
          ? 1
          : 0,
      JSON.stringify(scaledPrizes),
      existing.id
    );

    return getTournamentBySlugOrId(existing.id)!;
  });
}

export function deleteTournament(tournamentId: string): void {
  const db = getDb();
  runInTransaction(db, () => {
    const existing = getTournamentBySlugOrId(tournamentId);
    if (!existing) throw new Error('Турнір не знайдено.');
    db.prepare('DELETE FROM matches WHERE tournament_id = ?').run(existing.id);
    db.prepare('DELETE FROM participants WHERE tournament_id = ?').run(
      existing.id
    );
    db.prepare('DELETE FROM tournaments WHERE id = ?').run(existing.id);
  });
}

export function checkInMatch(matchId: string, actor: User): void {
  const db = getDb();
  runInTransaction(db, () => {
    const row = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId);
    if (!row) throw new Error('Матч не знайдено.');
    if (String(row.status) === 'COMPLETED') {
      throw new Error('Матч вже завершено.');
    }

    const p1Id = row.player1_id ? String(row.player1_id) : null;
    const p2Id = row.player2_id ? String(row.player2_id) : null;
    const now = new Date().toISOString();

    if (actor.id === p1Id) {
      db.prepare(
        'UPDATE matches SET p1_checked_in_at = COALESCE(p1_checked_in_at, ?), updated_at = ? WHERE id = ?'
      ).run(now, now, matchId);
    } else if (actor.id === p2Id) {
      db.prepare(
        'UPDATE matches SET p2_checked_in_at = COALESCE(p2_checked_in_at, ?), updated_at = ? WHERE id = ?'
      ).run(now, now, matchId);
    } else {
      throw new Error('Підтвердити готовність можуть лише учасники цього матчу.');
    }
  });
}

export function awardTechnicalWin(params: {
  matchId: string;
  winnerSlot: 1 | 2;
  actor: User;
  reason?: string;
}): void {
  const { matchId, winnerSlot, actor, reason } = params;
  if (actor.role !== 'ADMIN') {
    throw new Error(
      'Присудити технічну перемогу (ТП 3:0) може лише Головний Суддя.'
    );
  }
  const s1 = winnerSlot === 1 ? 3 : 0;
  const s2 = winnerSlot === 2 ? 3 : 0;
  const note =
    reason?.trim() ||
    `Технічна перемога (ТП 3:0) за неявку суперника або порушення регламенту`;

  submitMatchResult({
    matchId,
    actor,
    score1: s1,
    score2: s2,
    penalties1: null,
    penalties2: null,
    adminNote: note,
    instantConfirm: true,
  });
}

export function cleanDemoDataForRelease(
  mode: 'keep_cups' | 'full_wipe'
): { message: string } {
  const db = getDb();
  return runInTransaction(db, () => {
    db.exec('DELETE FROM matches');
    // Видаляємо лише демо-ботів (usr_p1..usr_p16 та згенерованих @cyberliga.ua), зберігаючи реальних зареєстрованих гравців
    db.exec(
      "DELETE FROM participants WHERE user_id IN (SELECT id FROM users WHERE role != 'ADMIN' AND (id LIKE 'usr_p%' OR email LIKE '%@cyberliga.ua'))"
    );
    db.exec(
      "DELETE FROM users WHERE role != 'ADMIN' AND (id LIKE 'usr_p%' OR email LIKE '%@cyberliga.ua')"
    );
    // Скидаємо статистику до чесного нуля перед стартом першого турніру
    db.exec(
      "UPDATE users SET season_points = 0, wins = 0, draws = 0, losses = 0, goals_for = 0, goals_against = 0, tournaments_won = 0, qualified_annual = 0 WHERE role != 'ADMIN'"
    );

    if (mode === 'full_wipe') {
      db.exec('DELETE FROM participants');
      db.exec('DELETE FROM tournaments');
      return {
        message:
          'Базу повністю очищено від демо-ботів, матчів та тестових кубків! Реальні акаунти гравців та Головного Судді збережено.',
      };
    }

    db.exec(
      "UPDATE tournaments SET status = 'REGISTRATION', champion_user_id = NULL"
    );
    db.exec(
      'UPDATE participants SET seed_pot = NULL, assigned_club_id = NULL, group_name = NULL'
    );
    return {
      message:
        'Усіх 16 демо-ботів та тестові матчі видалено! Турніри переведено у чистий старт сезону (0 зіграних матчів), реальні профілі гравців збережено.',
    };
  });
}

export function restoreDemoSeedData(): { message: string } {
  const db = getDb();
  return runInTransaction(db, () => {
    const customUsers = db
      .prepare(
        "SELECT * FROM users WHERE id != 'usr_admin' AND id NOT LIKE 'usr_p%' AND email NOT LIKE '%@cyberliga.ua' AND email NOT LIKE '%@bunker.ua'"
      )
      .all();

    db.exec('DELETE FROM matches');
    db.exec('DELETE FROM participants');
    db.exec('DELETE FROM tournaments');
    db.exec('DELETE FROM users');
    seedDatabase(db);

    const reinsertUser = db.prepare(`
      INSERT OR IGNORE INTO users (
        id, nickname, full_name, email, password_hash, city, platform, ea_id, telegram,
        role, season_points, wins, draws, losses, goals_for, goals_against,
        tournaments_won, qualified_annual, avatar_color, avatar_url, payout_card, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const u of customUsers) {
      reinsertUser.run(
        u.id,
        u.nickname,
        u.full_name,
        u.email,
        u.password_hash,
        u.city,
        u.platform,
        u.ea_id,
        u.telegram,
        u.role,
        u.season_points,
        u.wins,
        u.draws,
        u.losses,
        u.goals_for,
        u.goals_against,
        u.tournaments_won,
        u.qualified_annual,
        u.avatar_color,
        u.avatar_url || '',
        u.payout_card || '',
        u.created_at
      );
    }

    return {
      message:
        'Реальні дані Благодійного Турніру #1 (18 учасників, 5 груп A–E та сітка Плей-офф) успішно синхронізовано!',
    };
  });
}


