import type { SqliteDatabase } from './db';
import { hashPassword } from './crypto-utils';
import { ANNUAL_DEFAULT_PRIZES, MONTHLY_DEFAULT_PRIZES } from './constants';

export function seedDatabase(db: SqliteDatabase) {
  const now = '2026-11-07T12:00:00.000Z';
  const adminHash = hashPassword('admin123');
  const playerHash = hashPassword('player123');

  const insertUser = db.prepare(`
    INSERT INTO users (
      id, nickname, full_name, email, password_hash, city, platform, ea_id, telegram,
      role, season_points, wins, draws, losses, goals_for, goals_against,
      tournaments_won, qualified_annual, avatar_color, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Адміністратор / Організатор БУНКЕР UA
  insertUser.run(
    'usr_admin',
    'ChiefReferee_UA',
    'Організатор БУНКЕР UA',
    'admin@cyberliga.ua',
    adminHash,
    'Київ',
    'PS5',
    'Bunker_Ref_UA',
    '@bunker_admin',
    'ADMIN',
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    '#F5C451',
    now
  );

  // Реальні 18 учасників Благодійного Турніру #1 на підтримку ЗСУ (Групи A, B, C, D, E)
  const realPlayers: Array<{
    id: string;
    nickname: string;
    fullName: string;
    email: string;
    city: string;
    platform: 'PS5' | 'PC' | 'XBOX';
    eaId: string;
    telegram: string;
    pts: number;
    w: number;
    d: number;
    l: number;
    gf: number;
    ga: number;
    wonCups: number;
    qual: number;
    color: string;
  }> = [
    // ГРУПА A
    {
      id: 'usr_p1',
      nickname: 'BRS_Nederfox',
      fullName: 'КЛУБ • Фіналіст Турніру #1',
      email: 'nederfox@bunker.ua',
      city: 'Київ',
      platform: 'PS5',
      eaId: 'BRS_Nederfox',
      telegram: '@brs_nederfox',
      pts: 280,
      w: 7,
      d: 0,
      l: 1,
      gf: 43,
      ga: 13,
      wonCups: 0,
      qual: 1,
      color: '#F5C451',
    },
    {
      id: 'usr_p2',
      nickname: 'Grizzy',
      fullName: 'КЛУБ • Чвертьфіналіст (A2)',
      email: 'grizzy@bunker.ua',
      city: 'Львів',
      platform: 'PS5',
      eaId: 'Grizzy_UA',
      telegram: '@grizzy_fc',
      pts: 130,
      w: 1,
      d: 1,
      l: 1,
      gf: 13,
      ga: 14,
      wonCups: 0,
      qual: 0,
      color: '#00F59B',
    },
    {
      id: 'usr_p3',
      nickname: 'farawayka',
      fullName: 'ФАНАТ • Учасник Групи A',
      email: 'farawayka@bunker.ua',
      city: 'Дніпро',
      platform: 'PS5',
      eaId: 'farawayka',
      telegram: '@farawayka',
      pts: 65,
      w: 1,
      d: 0,
      l: 3,
      gf: 5,
      ga: 15,
      wonCups: 0,
      qual: 0,
      color: '#38BDF8',
    },
    {
      id: 'usr_p4',
      nickname: 'Doktot',
      fullName: 'ФАНАТ • Учасник Групи A',
      email: 'doktot@bunker.ua',
      city: 'Харків',
      platform: 'PC',
      eaId: 'Doktot_UA',
      telegram: '@doktot',
      pts: 65,
      w: 1,
      d: 0,
      l: 3,
      gf: 4,
      ga: 14,
      wonCups: 0,
      qual: 0,
      color: '#A78BFA',
    },

    // ГРУПА B
    {
      id: 'usr_p5',
      nickname: 'BRS_Vestern',
      fullName: 'КЛУБ • Чвертьфіналіст (B1)',
      email: 'vestern@bunker.ua',
      city: 'Одеса',
      platform: 'PS5',
      eaId: 'BRS_Vestern',
      telegram: '@brs_vestern',
      pts: 150,
      w: 3,
      d: 0,
      l: 2,
      gf: 12,
      ga: 13,
      wonCups: 0,
      qual: 0,
      color: '#00F59B',
    },
    {
      id: 'usr_p6',
      nickname: 'BRS_Hallowed',
      fullName: 'КЛУБ • Група B (9 очок)',
      email: 'hallowed@bunker.ua',
      city: 'Вінниця',
      platform: 'PS5',
      eaId: 'BRS_Hallowed',
      telegram: '@brs_hallowed',
      pts: 120,
      w: 3,
      d: 0,
      l: 1,
      gf: 9,
      ga: 10,
      wonCups: 0,
      qual: 0,
      color: '#F5C451',
    },
    {
      id: 'usr_p7',
      nickname: 'kAAp8r',
      fullName: 'ФАНАТ • Учасник Групи B',
      email: 'kaap8r@bunker.ua',
      city: 'Полтава',
      platform: 'PS5',
      eaId: 'kAAp8r',
      telegram: '@kaap8r',
      pts: 95,
      w: 2,
      d: 0,
      l: 0,
      gf: 2,
      ga: 0,
      wonCups: 0,
      qual: 0,
      color: '#22D3EE',
    },
    {
      id: 'usr_p8',
      nickname: 'berehovy1',
      fullName: 'ФАНАТ • Учасник Групи B',
      email: 'berehovy1@bunker.ua',
      city: 'Ужгород',
      platform: 'PS5',
      eaId: 'berehovy1',
      telegram: '@berehovy1',
      pts: 40,
      w: 0,
      d: 0,
      l: 6,
      gf: 0,
      ga: 6,
      wonCups: 0,
      qual: 0,
      color: '#64748B',
    },

    // ГРУПА C
    {
      id: 'usr_p9',
      nickname: 'BRS_Hasfer23',
      fullName: 'КЛУБ • Півфіналіст (C1)',
      email: 'hasfer23@bunker.ua',
      city: 'Київ',
      platform: 'PS5',
      eaId: 'BRS_Hasfer23',
      telegram: '@brs_hasfer23',
      pts: 210,
      w: 3,
      d: 1,
      l: 2,
      gf: 31,
      ga: 18,
      wonCups: 0,
      qual: 0,
      color: '#F5C451',
    },
    {
      id: 'usr_p10',
      nickname: 'Elaizer',
      fullName: 'КЛУБ • Півфіналіст (C2)',
      email: 'elaizer@bunker.ua',
      city: 'Львів',
      platform: 'PS5',
      eaId: 'Elaizer_UA',
      telegram: '@elaizer',
      pts: 235,
      w: 5,
      d: 1,
      l: 0,
      gf: 30,
      ga: 9,
      wonCups: 0,
      qual: 0,
      color: '#00F59B',
    },
    {
      id: 'usr_p11',
      nickname: 'ND',
      fullName: 'ФАНАТ • Учасник Групи C',
      email: 'nd@bunker.ua',
      city: 'Тернопіль',
      platform: 'PC',
      eaId: 'ND_Player',
      telegram: '@nd_fc',
      pts: 45,
      w: 0,
      d: 0,
      l: 2,
      gf: 1,
      ga: 11,
      wonCups: 0,
      qual: 0,
      color: '#38BDF8',
    },
    {
      id: 'usr_p12',
      nickname: 'Grud16',
      fullName: 'ФАНАТ • Учасник Групи C',
      email: 'grud16@bunker.ua',
      city: 'Чернігів',
      platform: 'PS5',
      eaId: 'Grud16',
      telegram: '@grud16',
      pts: 45,
      w: 0,
      d: 0,
      l: 3,
      gf: 2,
      ga: 25,
      wonCups: 0,
      qual: 0,
      color: '#FB7185',
    },

    // ГРУПА D
    {
      id: 'usr_p13',
      nickname: 'BRS_Lunnek1',
      fullName: 'КЛУБ • Чвертьфіналіст (D1)',
      email: 'lunnek1@bunker.ua',
      city: 'Київ',
      platform: 'PS5',
      eaId: 'BRS_Lunnek1',
      telegram: '@brs_lunnek1',
      pts: 175,
      w: 4,
      d: 0,
      l: 1,
      gf: 22,
      ga: 6,
      wonCups: 0,
      qual: 0,
      color: '#38BDF8',
    },
    {
      id: 'usr_p14',
      nickname: 'nikolay',
      fullName: 'ФАНАТ • 2 місце Групи D',
      email: 'nikolay@bunker.ua',
      city: 'Запоріжжя',
      platform: 'PS5',
      eaId: 'nikolay_fc',
      telegram: '@nikolay_ua',
      pts: 105,
      w: 2,
      d: 0,
      l: 2,
      gf: 10,
      ga: 12,
      wonCups: 0,
      qual: 0,
      color: '#22D3EE',
    },
    {
      id: 'usr_p15',
      nickname: 'Tripik',
      fullName: 'КЛУБ • Учасник Групи D',
      email: 'tripik@bunker.ua',
      city: 'Івано-Франківськ',
      platform: 'PS5',
      eaId: 'Tripik_UA',
      telegram: '@tripik',
      pts: 80,
      w: 1,
      d: 0,
      l: 1,
      gf: 4,
      ga: 4,
      wonCups: 0,
      qual: 0,
      color: '#F5C451',
    },
    {
      id: 'usr_p16',
      nickname: 'Osetskyi_3',
      fullName: 'ФАНАТ • Учасник Групи D',
      email: 'osetskyi3@bunker.ua',
      city: 'Рівне',
      platform: 'PS5',
      eaId: 'Osetskyi_3',
      telegram: '@osetskyi_3',
      pts: 60,
      w: 1,
      d: 0,
      l: 5,
      gf: 7,
      ga: 22,
      wonCups: 0,
      qual: 0,
      color: '#C084FC',
    },

    // ГРУПА E
    {
      id: 'usr_p17',
      nickname: 'BRS_YoungChamp18',
      fullName: 'КЛУБ • Півфіналіст (E1)',
      email: 'youngchamp18@bunker.ua',
      city: 'Київ',
      platform: 'PS5',
      eaId: 'BRS_YoungChamp18',
      telegram: '@brs_youngchamp18',
      pts: 220,
      w: 2,
      d: 1,
      l: 0,
      gf: 14,
      ga: 8,
      wonCups: 0,
      qual: 0,
      color: '#00F59B',
    },
    {
      id: 'usr_p18',
      nickname: 'BRS_PELTIK88',
      fullName: 'КЛУБ • Чвертьфіналіст (E2)',
      email: 'peltik88@bunker.ua',
      city: 'Дніпро',
      platform: 'PS5',
      eaId: 'BRS_PELTIK88',
      telegram: '@brs_peltik88',
      pts: 125,
      w: 0,
      d: 0,
      l: 3,
      gf: 5,
      ga: 14,
      wonCups: 0,
      qual: 0,
      color: '#F5C451',
    },
  ];

  for (const p of realPlayers) {
    insertUser.run(
      p.id,
      p.nickname,
      p.fullName,
      p.email,
      playerHash,
      p.city,
      p.platform,
      p.eaId,
      p.telegram,
      'PLAYER',
      p.pts,
      p.w,
      p.d,
      p.l,
      p.gf,
      p.ga,
      p.wonCups,
      p.qual,
      p.color,
      now
    );
  }

  const insertTournament = db.prepare(`
    INSERT INTO tournaments (
      id, slug, title, subtitle, cup_type, game_mode, club_pool, equal_95_ovr,
      prize_pool_uah, entry_fee_uah, max_players, group_size, status,
      season_year, month_label, start_date, rules_note, prize_breakdown_json,
      champion_user_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1) Поточний Благодійний Турнір #1 на підтримку ЗСУ (LIVE: Плей-офф, до Гранд-Фіналу)
  insertTournament.run(
    'trn_oct_2026',
    'october-cup-2026',
    'Благодійний Турнір #1 • На підтримку ЗСУ',
    'ЛЧ • 2 кола (5 груп A–E + Плей-офф) • Зібрано 2 145 ₴ на банку ЗСУ • Нагорода від воїнів ЗСУ',
    'MONTHLY',
    'ULTIMATE_TEAM',
    'NONE',
    0,
    0,
    10,
    32,
    4,
    'PLAYOFF',
    2026,
    'Турнір #1 • LIVE',
    '2026-11-01',
    'Перший благодійний турнір 1v1 в EA FC на підтримку ЗСУ (банка зібрала вже 2 145 грн — 100% коштів передаємо фонду Project Ukraine, переможець отримує пам’ятну нагороду від воїнів ЗСУ 🎖️). Груповий етап у 2 кола (5 груп A–E) завершено, триває стадія Плей-офф: BRS_Nederfox вже у Гранд-Фіналі та чекає на переможця півфіналу BRS_YoungChamp18 vs Elaizer!',
    JSON.stringify(MONTHLY_DEFAULT_PRIZES),
    null,
    now
  );

  // 2) Наступний Благодійний Турнір #2 — Відкрита реєстрація
  insertTournament.run(
    'trn_nov_2026',
    'november-cup-2026',
    'Благодійний Турнір #2 • На підтримку ЗСУ',
    'Система Ліги Чемпіонів (Групи + Плей-офф) • Приз: пам’ятна нагорода від воїнів ЗСУ',
    'MONTHLY',
    'ULTIMATE_TEAM',
    'NONE',
    0,
    0,
    10,
    16,
    4,
    'REGISTRATION',
    2026,
    'Набір відкрито',
    '2026-11-15',
    'Благодійний турнір 1х1 в EA FC на підтримку ЗСУ (усі 100% внесків передаємо фонду Project Ukraine). Тотального контролю по внесках немає — кожен кидає на банку ЗСУ скільки хоче і може (від 10 грн). Графік вільний: про час та дату матчів гравці домовляються між собою в Telegram (бажано зіграти групу протягом тижня).',
    JSON.stringify(MONTHLY_DEFAULT_PRIZES),
    null,
    now
  );

  // 3) Підсумковий Гранд-Фінал Сезону
  insertTournament.run(
    'trn_annual_2027',
    'ukraine-grand-final-2027',
    'Підсумковий Кубок Сезону • БУНКЕР UA',
    'Турнір переможців та найкращих гравців рейтингу • Головна нагорода від воїнів ЗСУ',
    'ANNUAL',
    'ULTIMATE_TEAM',
    'NONE',
    0,
    0,
    0,
    16,
    4,
    'REGISTRATION',
    2026,
    'Фінал Сезону',
    '2026-12-20',
    'Підсумковий благодійний турнір сезону для чемпіонів та лідерів рейтингу БУНКЕР UA. Головний приз — ексклюзивна пам’ятна нагорода від воїнів ЗСУ.',
    JSON.stringify(ANNUAL_DEFAULT_PRIZES),
    null,
    now
  );

  // Учасники Турніру #1 (18 реальних гравців по 5 групах A, B, C, D, E)
  const insertParticipant = db.prepare(`
    INSERT INTO participants (
      id, tournament_id, user_id, seed_pot, assigned_club_id, group_name, payment_status, registered_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tourney1Setup: Array<{
    userId: string;
    pot: number;
    group: 'A' | 'B' | 'C' | 'D' | 'E';
  }> = [
    // Група A
    { userId: 'usr_p1', pot: 1, group: 'A' }, // BRS_Nederfox
    { userId: 'usr_p2', pot: 2, group: 'A' }, // Grizzy
    { userId: 'usr_p3', pot: 3, group: 'A' }, // farawayka
    { userId: 'usr_p4', pot: 4, group: 'A' }, // Doktot
    // Група B
    { userId: 'usr_p5', pot: 1, group: 'B' }, // BRS_Vestern
    { userId: 'usr_p6', pot: 2, group: 'B' }, // BRS_Hallowed
    { userId: 'usr_p7', pot: 3, group: 'B' }, // kAAp8r
    { userId: 'usr_p8', pot: 4, group: 'B' }, // berehovy1
    // Група C
    { userId: 'usr_p10', pot: 1, group: 'C' }, // Elaizer
    { userId: 'usr_p9', pot: 2, group: 'C' }, // BRS_Hasfer23
    { userId: 'usr_p11', pot: 3, group: 'C' }, // ND
    { userId: 'usr_p12', pot: 4, group: 'C' }, // Grud16
    // Група D
    { userId: 'usr_p13', pot: 1, group: 'D' }, // BRS_Lunnek1
    { userId: 'usr_p14', pot: 2, group: 'D' }, // nikolay
    { userId: 'usr_p15', pot: 3, group: 'D' }, // Tripik
    { userId: 'usr_p16', pot: 4, group: 'D' }, // Osetskyi_3
    // Група E
    { userId: 'usr_p17', pot: 1, group: 'E' }, // BRS_YoungChamp18
    { userId: 'usr_p18', pot: 2, group: 'E' }, // BRS_PELTIK88
  ];

  tourney1Setup.forEach((row, idx) => {
    insertParticipant.run(
      `prt_t1_${idx + 1}`,
      'trn_oct_2026',
      row.userId,
      row.pot,
      null,
      row.group,
      'PAID',
      now
    );
  });

  // Реальні 33 зіграні матчі групового етапу (2 кола в групах A–E), що дають 100% точні таблиці зі скріншотів:
  const insertMatch = db.prepare(`
    INSERT INTO matches (
      id, tournament_id, stage, group_name, round_number, playoff_round, match_order,
      player1_id, player2_id, score1, score2, penalties1, penalties2, winner_id,
      status, submitted_by_id, proof_image_url, dispute_reason, dispute_image_url,
      admin_note, next_match_id, next_match_slot, loser_next_match_id, loser_next_match_slot, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const groupFixtures: Array<{
    group: 'A' | 'B' | 'C' | 'D' | 'E';
    round: number;
    p1: string;
    p2: string;
    s1: number;
    s2: number;
    note?: string;
  }> = [
    // ГРУПА A (8/12 ігор):
    // BRS_Nederfox (6 І, 5 В, 0 Н, 1 П, РМ +21, 15 ОЧК)
    // Grizzy (2 І, 1 В, 0 Н, 1 П, РМ -1, 3 ОЧК) -> зіграли 3:1 та 5:6
    // farawayka (4 І, 1 В, 0 Н, 3 П, РМ -10, 3 ОЧК)
    // Doktot (4 І, 1 В, 0 Н, 3 П, РМ -10, 3 ОЧК)
    { group: 'A', round: 1, p1: 'usr_p1', p2: 'usr_p2', s1: 3, s2: 1 },
    { group: 'A', round: 2, p1: 'usr_p2', p2: 'usr_p1', s1: 6, s2: 5 },
    { group: 'A', round: 1, p1: 'usr_p1', p2: 'usr_p3', s1: 6, s2: 0 },
    { group: 'A', round: 2, p1: 'usr_p3', p2: 'usr_p1', s1: 1, s2: 5 },
    { group: 'A', round: 1, p1: 'usr_p1', p2: 'usr_p4', s1: 6, s2: 0 },
    { group: 'A', round: 2, p1: 'usr_p4', p2: 'usr_p1', s1: 0, s2: 4 },
    { group: 'A', round: 1, p1: 'usr_p3', p2: 'usr_p4', s1: 3, s2: 2 },
    { group: 'A', round: 2, p1: 'usr_p4', p2: 'usr_p3', s1: 2, s2: 1 },

    // ГРУПА B (8/12 ігор):
    // BRS_Vestern (4 І, 3 В, 0 Н, 1 П, РМ +5, 9 ОЧК) -> 7:2 і 3:5 проти BRS_Hallowed + двічі 1:0 проти berehovy1
    // BRS_Hallowed (4 І, 3 В, 0 Н, 1 П, РМ -1, 9 ОЧК)
    // kAAp8r (2 І, 2 В, 0 Н, 0 П, РМ +2, 6 ОЧК)
    // berehovy1 (6 І, 0 В, 0 Н, 6 П, РМ -6, 0 ОЧК) -> технічні 0:1 за вихід
    { group: 'B', round: 1, p1: 'usr_p5', p2: 'usr_p6', s1: 7, s2: 2 },
    { group: 'B', round: 2, p1: 'usr_p6', p2: 'usr_p5', s1: 5, s2: 3 },
    {
      group: 'B',
      round: 1,
      p1: 'usr_p5',
      p2: 'usr_p8',
      s1: 1,
      s2: 0,
      note: 'Технічний результат 1:0 (вихід berehovy1)',
    },
    {
      group: 'B',
      round: 2,
      p1: 'usr_p8',
      p2: 'usr_p5',
      s1: 0,
      s2: 1,
      note: 'Технічний результат 0:1 (вихід berehovy1)',
    },
    {
      group: 'B',
      round: 1,
      p1: 'usr_p6',
      p2: 'usr_p8',
      s1: 1,
      s2: 0,
      note: 'Технічний результат 1:0 (вихід berehovy1)',
    },
    {
      group: 'B',
      round: 2,
      p1: 'usr_p8',
      p2: 'usr_p6',
      s1: 0,
      s2: 1,
      note: 'Технічний результат 0:1 (вихід berehovy1)',
    },
    {
      group: 'B',
      round: 1,
      p1: 'usr_p7',
      p2: 'usr_p8',
      s1: 1,
      s2: 0,
      note: 'Технічний результат 1:0 (вихід berehovy1)',
    },
    {
      group: 'B',
      round: 2,
      p1: 'usr_p8',
      p2: 'usr_p7',
      s1: 0,
      s2: 1,
      note: 'Технічний результат 0:1 (вихід berehovy1)',
    },

    // ГРУПА C (7/12 ігор):
    // Elaizer (5 І, 4 В, 1 Н, 0 П, РМ +18, 13 ОЧК)
    // BRS_Hasfer23 (4 І, 2 В, 1 Н, 1 П, РМ +15, 7 ОЧК)
    // ND (2 І, 0 В, 0 Н, 2 П, РМ -10, 0 ОЧК)
    // Grud16 (3 І, 0 В, 0 Н, 3 П, РМ -23, 0 ОЧК)
    { group: 'C', round: 1, p1: 'usr_p10', p2: 'usr_p9', s1: 2, s2: 2 },
    { group: 'C', round: 2, p1: 'usr_p9', p2: 'usr_p10', s1: 2, s2: 3 },
    { group: 'C', round: 1, p1: 'usr_p10', p2: 'usr_p11', s1: 5, s2: 0 },
    { group: 'C', round: 2, p1: 'usr_p11', p2: 'usr_p10', s1: 1, s2: 6 },
    { group: 'C', round: 1, p1: 'usr_p10', p2: 'usr_p12', s1: 8, s2: 1 },
    { group: 'C', round: 1, p1: 'usr_p9', p2: 'usr_p12', s1: 8, s2: 0 },
    { group: 'C', round: 2, p1: 'usr_p12', p2: 'usr_p9', s1: 1, s2: 9 },

    // ГРУПА D (8/12 ігор):
    // BRS_Lunnek1 (4 І, 4 В, 0 Н, 0 П, РМ +17, 12 ОЧК)
    // nikolay (4 І, 2 В, 0 Н, 2 П, РМ -2, 6 ОЧК) -> двічі обіграв Osetskyi_3 (3:0 і 6:2)
    // Tripik (2 І, 1 В, 0 Н, 1 П, РМ 0, 3 ОЧК)
    // Osetskyi_3 (6 І, 1 В, 0 Н, 5 П, РМ -15, 3 ОЧК)
    { group: 'D', round: 1, p1: 'usr_p14', p2: 'usr_p16', s1: 3, s2: 0 },
    { group: 'D', round: 2, p1: 'usr_p16', p2: 'usr_p14', s1: 2, s2: 6 },
    { group: 'D', round: 1, p1: 'usr_p13', p2: 'usr_p14', s1: 5, s2: 1 },
    { group: 'D', round: 2, p1: 'usr_p14', p2: 'usr_p13', s1: 0, s2: 5 },
    { group: 'D', round: 1, p1: 'usr_p13', p2: 'usr_p16', s1: 5, s2: 0 },
    { group: 'D', round: 2, p1: 'usr_p16', p2: 'usr_p13', s1: 0, s2: 4 },
    { group: 'D', round: 1, p1: 'usr_p15', p2: 'usr_p16', s1: 3, s2: 1 },
    { group: 'D', round: 2, p1: 'usr_p16', p2: 'usr_p15', s1: 3, s2: 1 },

    // ГРУПА E (2/2 ігор завершено):
    // BRS_YoungChamp18 (2 І, 2 В, 0 Н, 0 П, РМ +6, 6 ОЧК)
    // BRS_PELTIK88 (2 І, 0 В, 0 Н, 2 П, РМ -6, 0 ОЧК)
    { group: 'E', round: 1, p1: 'usr_p17', p2: 'usr_p18', s1: 4, s2: 1 },
    { group: 'E', round: 2, p1: 'usr_p18', p2: 'usr_p17', s1: 1, s2: 4 },
  ];

  groupFixtures.forEach((m, idx) => {
    const winner = m.s1 > m.s2 ? m.p1 : m.s2 > m.s1 ? m.p2 : null;
    insertMatch.run(
      `m_oct_grp_${idx + 1}`,
      'trn_oct_2026',
      'GROUP',
      m.group,
      m.round,
      null,
      idx + 1,
      m.p1,
      m.p2,
      m.s1,
      m.s2,
      null,
      null,
      winner,
      'COMPLETED',
      m.p1,
      null,
      null,
      null,
      m.note ?? null,
      null,
      null,
      null,
      null,
      now
    );
  });

  // ============================================================================
  // ОЛІМПІЙСЬКА СІТКА ПЛЕЙ-ОФФ (1/4 Фіналу -> 1/2 Фіналу -> Матч за 3 місце & Гранд-Фінал)
  // Точно за скріншотами Турніру #1:
  // ============================================================================

  // ГРАНД-ФІНАЛ: A1 BRS_Nederfox vs TBA (переможець пари BRS_YoungChamp18 vs Elaizer)
  insertMatch.run(
    'm_oct_final',
    'trn_oct_2026',
    'PLAYOFF',
    null,
    3,
    'FINAL',
    1,
    'usr_p1', // BRS_Nederfox (A1)
    null, // TBA
    null,
    null,
    null,
    null,
    null,
    'SCHEDULED',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    now
  );

  // МАТЧ ЗА 3-ТЄ МІСЦЕ: C1 BRS_Hasfer23 vs TBA (той, хто поступиться у парі BRS_YoungChamp18 vs Elaizer)
  insertMatch.run(
    'm_oct_third',
    'trn_oct_2026',
    'PLAYOFF',
    null,
    3,
    'THIRD',
    1,
    'usr_p9', // BRS_Hasfer23 (C1)
    null, // TBA
    null,
    null,
    null,
    null,
    null,
    'SCHEDULED',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    now
  );

  // 1/2 ФІНАЛУ (ПІВФІНАЛ 1 — Завершено): A1 BRS_Nederfox 8 : 5 C1 BRS_Hasfer23
  insertMatch.run(
    'm_oct_sf1',
    'trn_oct_2026',
    'PLAYOFF',
    null,
    2,
    'SF',
    1,
    'usr_p1', // BRS_Nederfox (A1)
    'usr_p9', // BRS_Hasfer23 (C1)
    8,
    5,
    null,
    null,
    'usr_p1',
    'COMPLETED',
    'usr_p1',
    null,
    null,
    null,
    'Півфінал 1 завершено: BRS_Nederfox крокує у Гранд-Фінал (8:5)!',
    'm_oct_final',
    1,
    'm_oct_third',
    1,
    now
  );

  // 1/2 ФІНАЛУ (ПІВФІНАЛ 2 — Очікується матч): E1 BRS_YoungChamp18 vs C2 Elaizer
  insertMatch.run(
    'm_oct_sf2',
    'trn_oct_2026',
    'PLAYOFF',
    null,
    2,
    'SF',
    2,
    'usr_p17', // BRS_YoungChamp18 (E1)
    'usr_p10', // Elaizer (C2)
    null,
    null,
    null,
    null,
    null,
    'SCHEDULED',
    null,
    null,
    null,
    null,
    null,
    'm_oct_final',
    2,
    'm_oct_third',
    2,
    now
  );

  // 1/4 ФІНАЛУ (ЧВЕРТЬФІНАЛ 1 — Завершено): A1 BRS_Nederfox 6 : 0 B1 BRS_Vestern
  insertMatch.run(
    'm_oct_qf1',
    'trn_oct_2026',
    'PLAYOFF',
    null,
    1,
    'QF',
    1,
    'usr_p1', // BRS_Nederfox (A1)
    'usr_p5', // BRS_Vestern (B1)
    6,
    0,
    null,
    null,
    'usr_p1',
    'COMPLETED',
    'usr_p1',
    null,
    null,
    null,
    null,
    'm_oct_sf1',
    1,
    null,
    null,
    now
  );

  // 1/4 ФІНАЛУ (ЧВЕРТЬФІНАЛ 2 — Завершено): C1 BRS_Hasfer23 5 : 4 D1 BRS_Lunnek1
  insertMatch.run(
    'm_oct_qf2',
    'trn_oct_2026',
    'PLAYOFF',
    null,
    1,
    'QF',
    2,
    'usr_p9', // BRS_Hasfer23 (C1)
    'usr_p13', // BRS_Lunnek1 (D1)
    5,
    4,
    null,
    null,
    'usr_p9',
    'COMPLETED',
    'usr_p9',
    null,
    null,
    null,
    null,
    'm_oct_sf1',
    2,
    null,
    null,
    now
  );

  // 1/4 ФІНАЛУ (ЧВЕРТЬФІНАЛ 3 — Завершено): E1 BRS_YoungChamp18 6 : 6 (пен. 5:4) A2 Grizzy
  insertMatch.run(
    'm_oct_qf3',
    'trn_oct_2026',
    'PLAYOFF',
    null,
    1,
    'QF',
    3,
    'usr_p17', // BRS_YoungChamp18 (E1)
    'usr_p2', // Grizzy (A2)
    6,
    6,
    5,
    4,
    'usr_p17',
    'COMPLETED',
    'usr_p17',
    null,
    null,
    null,
    'Перемога BRS_YoungChamp18 після нічиєї 6:6 в основний час',
    'm_oct_sf2',
    1,
    null,
    null,
    now
  );

  // 1/4 ФІНАЛУ (ЧВЕРТЬФІНАЛ 4 — Завершено): E2 BRS_PELTIK88 3 : 6 C2 Elaizer
  insertMatch.run(
    'm_oct_qf4',
    'trn_oct_2026',
    'PLAYOFF',
    null,
    1,
    'QF',
    4,
    'usr_p18', // BRS_PELTIK88 (E2)
    'usr_p10', // Elaizer (C2)
    3,
    6,
    null,
    null,
    'usr_p10',
    'COMPLETED',
    'usr_p10',
    null,
    null,
    null,
    null,
    'm_oct_sf2',
    2,
    null,
    null,
    now
  );
}
