import path from 'path';

// Use PostgreSQL on Render (DATABASE_URL set), SQLite locally
const isPg = !!process.env.DATABASE_URL;

let _query: (text: string, params?: any[]) => Promise<{ rows: any[] }>;
let _initDb: () => Promise<void>;

if (isPg) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  _query = (text, params) => pool.query(text, params);
  _initDb = async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nickname TEXT NOT NULL DEFAULT '부적 초보자',
        device_id TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS talismans (
        id TEXT PRIMARY KEY, category TEXT NOT NULL, base_name TEXT NOT NULL,
        rarity TEXT NOT NULL DEFAULT 'common', emoji TEXT NOT NULL DEFAULT '🏮', quote TEXT NOT NULL DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS user_talismans (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
        talisman_id TEXT NOT NULL REFERENCES talismans(id),
        level INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active',
        obtained_at TIMESTAMPTZ DEFAULT NOW(), broken_at TIMESTAMPTZ
      );
      CREATE TABLE IF NOT EXISTS enhancement_logs (
        id TEXT PRIMARY KEY, user_talisman_id TEXT NOT NULL REFERENCES user_talismans(id),
        from_level INTEGER NOT NULL, to_level INTEGER,
        success BOOLEAN NOT NULL, destroyed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS daily_draws (
        user_id TEXT NOT NULL, draw_date TEXT NOT NULL, PRIMARY KEY (user_id, draw_date)
      );
    `);
    await _seedTalismans();
  };
} else {
  const Database = require('better-sqlite3');
  const db = new Database(path.join(__dirname, '../../boojeok.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, nickname TEXT NOT NULL DEFAULT '부적 초보자', device_id TEXT UNIQUE, created_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS talismans (id TEXT PRIMARY KEY, category TEXT NOT NULL, base_name TEXT NOT NULL, rarity TEXT NOT NULL DEFAULT 'common', emoji TEXT NOT NULL DEFAULT '🏮', quote TEXT NOT NULL DEFAULT '');
    CREATE TABLE IF NOT EXISTS user_talismans (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), talisman_id TEXT NOT NULL REFERENCES talismans(id), level INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active', obtained_at TEXT DEFAULT (datetime('now')), broken_at TEXT);
    CREATE TABLE IF NOT EXISTS enhancement_logs (id TEXT PRIMARY KEY, user_talisman_id TEXT NOT NULL REFERENCES user_talismans(id), from_level INTEGER NOT NULL, to_level INTEGER, success INTEGER NOT NULL, destroyed INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS daily_draws (user_id TEXT NOT NULL, draw_date TEXT NOT NULL, PRIMARY KEY (user_id, draw_date));
  `);
  _query = async (text, params = []) => {
    // Convert $1,$2 placeholders to ? for SQLite
    let i = 0;
    const sql = text.replace(/\$\d+/g, () => '?');
    if (sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('WITH')) {
      return { rows: db.prepare(sql).all(...params) };
    }
    db.prepare(sql).run(...params);
    return { rows: [] };
  };
  _initDb = async () => { await _seedTalismans(); };
}

async function _seedTalismans() {
  const { rows } = await _query('SELECT COUNT(*) AS n FROM talismans');
  const count = parseInt(rows[0]?.n ?? rows[0]?.['COUNT(*)'] ?? '0');
  if (count > 0) return;
  const seeds = [
    ['t01','office','팀장님 기억상실 부적','common','💼','"오늘 한 모든 실수를 팀장님이 잊게 하리라"'],
    ['t02','office','월급 루팡 무죄 부적','rare','💰','"월급날만큼은 모든 것이 용서되리라"'],
    ['t03','office','카톡 퇴근 시급 부적','common','📱','"업무 카톡은 내일 아침에 보이리라"'],
    ['t04','life','지하철 앞자리 빌런 퇴치 부적','common','🚇','"다리 넓히는 자, 오므리게 하리라"'],
    ['t05','life','알고리즘 중독 탈출 부적','rare','📲','"무한 스크롤의 사슬을 끊어주리라"'],
    ['t06','life','다이어트 내일부터 부적','legendary','🍕','"오늘만큼은 죄가 없음을 선언하리라"'],
    ['t07','love','눈치 챙겨 부적','common','👀','"상대의 마음을 읽게 하리라"'],
    ['t08','love','안읽씹 차단 부적','rare','💬','"이중 체크가 영원히 뜨게 하리라"'],
    ['t09','love','고백 공격 방어 부적','legendary','💘','"거절도 고백도 아닌 그 사이로 인도하리라"'],
  ];
  for (const s of seeds) {
    await _query(
      'INSERT INTO talismans (id,category,base_name,rarity,emoji,quote) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING',
      s
    );
  }
}

export const query = _query;
export const initDb = _initDb;
