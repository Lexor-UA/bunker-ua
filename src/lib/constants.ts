import { PrizeTier } from './types';

// Благодійна банка на підтримку ЗСУ (Project Ukraine)
export const ZSU_MONOBANK_JAR_URL = 'https://send.monobank.ua/jar/6aFeFX1Lk2';
export const ZSU_MONOBANK_CARD = '4874 1000 3491 9384';
export const ZSU_MONOBANK_CARD_RAW = '4874100034919384';
export const ZSU_CHARITY_FUND_NAME = 'Project Ukraine';
export const ZSU_MAIN_PRIZE_TITLE = 'Пам’ятна нагорода від воїнів ЗСУ';

// Офіційні ліміти EA Sports FC Community Tournament Guidelines (без комерційної ліцензії)
export const EA_ANNUAL_PRIZE_CAP_USD = 10000;
export const EA_MAX_ENTRY_FEE_USD = 20;
export const UAH_PER_USD_RATE = 41.5;

export const EA_ANNUAL_PRIZE_CAP_UAH = Math.round(
  EA_ANNUAL_PRIZE_CAP_USD * UAH_PER_USD_RATE
); // 415 000 ₴ / рік
export const EA_MAX_ENTRY_FEE_UAH = Math.floor(
  EA_MAX_ENTRY_FEE_USD * UAH_PER_USD_RATE
); // 830 ₴ макс. внесок

export const EA_OFFICIAL_DISCLAIMER_EN =
  'This tournament is not affiliated with or sponsored by Electronic Arts Inc. or its licensors.';

export const EA_OFFICIAL_DISCLAIMER_UA =
  'Благодійний турнір 1v1 на підтримку ЗСУ (100% донатів передається фонду Project Ukraine). Проводиться відповідно до EA Community Tournament Guidelines.';

export const MONTHLY_DEFAULT_PRIZES: PrizeTier[] = [
  {
    place: '1 місце (Чемпіон)',
    amountUah: 0,
    points: 250,
    badge: '🎖️ Пам’ятна нагорода від воїнів ЗСУ + Золотий кубок',
  },
  {
    place: '2 місце (Фіналіст)',
    amountUah: 0,
    points: 180,
    badge: '🥈 Срібна відзнака благодійного кубка',
  },
  {
    place: '3 місце',
    amountUah: 0,
    points: 135,
    badge: '🥉 Бронзова відзнака благодійного кубка',
  },
  {
    place: '4 місце (Півфінал)',
    amountUah: 0,
    points: 110,
  },
  {
    place: '1/4 фіналу (5–8 місця)',
    amountUah: 0,
    points: 75,
  },
  {
    place: 'Груповий етап',
    amountUah: 0,
    points: 25,
  },
];

export const ANNUAL_DEFAULT_PRIZES: PrizeTier[] = [
  {
    place: 'Чемпіон Сезону (1 місце)',
    amountUah: 0,
    points: 1000,
    badge: '🏆 Головна нагорода від воїнів ЗСУ + Кубок БУНКЕР UA',
  },
  {
    place: 'Віце-чемпіон (2 місце)',
    amountUah: 0,
    points: 700,
    badge: '🥈 Срібний призер сезону',
  },
  {
    place: '3 місце',
    amountUah: 0,
    points: 500,
    badge: '🥉 Бронзовий призер сезону',
  },
  {
    place: '4 місце',
    amountUah: 0,
    points: 350,
  },
  {
    place: '1/4 фіналу (5–8 місця)',
    amountUah: 0,
    points: 200,
  },
];

export const UKRAINIAN_CITIES = [
  'Київ',
  'Львів',
  'Харків',
  'Одеса',
  'Дніпро',
  'Вінниця',
  'Івано-Франківськ',
  'Запоріжжя',
  'Полтава',
  'Тернопіль',
  'Чернівці',
  'Рівне',
  'Луцьк',
  'Ужгород',
  'Черкаси',
  'Миколаїв',
  'Хмельницький',
  'Житомир',
  'Чернігів',
  'Суми',
  'Кропивницький',
];

