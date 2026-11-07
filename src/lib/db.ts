import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { seedDatabase } from './seed';

export interface SqliteStatement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run(...params: any[]): {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(...params: any[]): Record<string, unknown> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  all(...params: any[]): Record<string, unknown>[];
}

export interface SqliteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
  close(): void;
}

type NodeWithBuiltin = typeof process & {
  getBuiltinModule: (id: string) => {
    DatabaseSync: new (filename: string) => SqliteDatabase;
  };
};

declare global {
  // eslint-disable-next-line no-var
  var __cyberligaDb: SqliteDatabase | undefined;
  // eslint-disable-next-line no-var
  var __cyberligaSchemaV3: boolean | undefined;
}

function initSchema(db: SqliteDatabase) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      city TEXT NOT NULL,
      platform TEXT NOT NULL DEFAULT 'PS5',
      ea_id TEXT NOT NULL,
      telegram TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'PLAYER',
      season_points INTEGER NOT NULL DEFAULT 0,
      wins INTEGER NOT NULL DEFAULT 0,
      draws INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      goals_for INTEGER NOT NULL DEFAULT 0,
      goals_against INTEGER NOT NULL DEFAULT 0,
      tournaments_won INTEGER NOT NULL DEFAULT 0,
      qualified_annual INTEGER NOT NULL DEFAULT 0,
      avatar_color TEXT NOT NULL DEFAULT '#00F59B',
      avatar_url TEXT NOT NULL DEFAULT '',
      payout_card TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      cup_type TEXT NOT NULL,
      game_mode TEXT NOT NULL,
      club_pool TEXT NOT NULL DEFAULT 'ALL_TOP',
      equal_95_ovr INTEGER NOT NULL DEFAULT 0,
      prize_pool_uah INTEGER NOT NULL,
      entry_fee_uah INTEGER NOT NULL DEFAULT 0,
      max_players INTEGER NOT NULL DEFAULT 16,
      group_size INTEGER NOT NULL DEFAULT 4,
      status TEXT NOT NULL DEFAULT 'REGISTRATION',
      season_year INTEGER NOT NULL DEFAULT 2026,
      month_label TEXT NOT NULL,
      start_date TEXT NOT NULL,
      rules_note TEXT NOT NULL,
      prize_breakdown_json TEXT NOT NULL,
      champion_user_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (champion_user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      tournament_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      seed_pot INTEGER,
      assigned_club_id TEXT,
      group_name TEXT,
      payment_status TEXT NOT NULL DEFAULT 'FREE',
      registered_at TEXT NOT NULL,
      UNIQUE(tournament_id, user_id),
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      tournament_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      group_name TEXT,
      round_number INTEGER NOT NULL DEFAULT 1,
      playoff_round TEXT,
      match_order INTEGER NOT NULL DEFAULT 1,
      player1_id TEXT,
      player2_id TEXT,
      score1 INTEGER,
      score2 INTEGER,
      penalties1 INTEGER,
      penalties2 INTEGER,
      winner_id TEXT,
      status TEXT NOT NULL DEFAULT 'SCHEDULED',
      submitted_by_id TEXT,
      proof_image_url TEXT,
      dispute_reason TEXT,
      dispute_image_url TEXT,
      admin_note TEXT,
      p1_checked_in_at TEXT,
      p2_checked_in_at TEXT,
      next_match_id TEXT,
      next_match_slot INTEGER,
      loser_next_match_id TEXT,
      loser_next_match_slot INTEGER,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_participants_tournament ON participants(tournament_id);
    CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
    CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
  `);

  // Safe schema migrations for existing SQLite database files
  const userCols = new Set(
    db
      .prepare('PRAGMA table_info(users)')
      .all()
      .map((c) => String(c.name))
  );
  if (!userCols.has('payout_card')) {
    db.exec("ALTER TABLE users ADD COLUMN payout_card TEXT NOT NULL DEFAULT ''");
  }
  if (!userCols.has('avatar_url')) {
    db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT NOT NULL DEFAULT ''");
  }

  const matchCols = new Set(
    db
      .prepare('PRAGMA table_info(matches)')
      .all()
      .map((c) => String(c.name))
  );
  if (!matchCols.has('p1_checked_in_at')) {
    db.exec('ALTER TABLE matches ADD COLUMN p1_checked_in_at TEXT');
  }
  if (!matchCols.has('p2_checked_in_at')) {
    db.exec('ALTER TABLE matches ADD COLUMN p2_checked_in_at TEXT');
  }
}

function ensureRealTournamentV1(db: SqliteDatabase) {
  const realCheck = db
    .prepare("SELECT id FROM users WHERE id = 'usr_p1' AND nickname = 'BRS_Nederfox'")
    .get();
  if (realCheck) return;

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
}

export function getDb(): SqliteDatabase {
  if (global.__cyberligaDb) {
    if (!global.__cyberligaSchemaV3) {
      initSchema(global.__cyberligaDb);
      global.__cyberligaSchemaV3 = true;
    }
    ensureRealTournamentV1(global.__cyberligaDb);
    return global.__cyberligaDb;
  }

  let dbPath = path.join(process.cwd(), 'data', 'cyberliga.db');
  const isServerlessRuntime = Boolean(
    process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT
  );

  if (isServerlessRuntime) {
    dbPath = path.join(os.tmpdir(), 'bunker-ua.db');
  } else {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch {
      dbPath = path.join(os.tmpdir(), 'bunker-ua.db');
    }
  }

  const sqlite = (process as NodeWithBuiltin).getBuiltinModule('node:sqlite');
  let db: SqliteDatabase;
  try {
    db = new sqlite.DatabaseSync(dbPath);
  } catch {
    db = new sqlite.DatabaseSync(path.join(os.tmpdir(), 'bunker-ua.db'));
  }

  initSchema(db);
  global.__cyberligaSchemaV3 = true;

  const countRow = db
    .prepare('SELECT COUNT(*) as cnt FROM users')
    .get() as { cnt: number } | undefined;

  if (!countRow || Number(countRow.cnt) === 0) {
    seedDatabase(db);
  } else {
    ensureRealTournamentV1(db);
  }

  global.__cyberligaDb = db;
  return db;
}

export function runInTransaction<T>(db: SqliteDatabase, fn: () => T): T {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
