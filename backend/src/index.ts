import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import { query, initDb } from './db';
import { attempt, SUCCESS_RATES, DESTROY_RATES } from './enhance';

const app = express();
app.use(cors());
app.use(express.json());

// ── Auth ────────────────────────────────────────────────
app.post('/api/auth/guest', async (req, res) => {
  try {
    const { nickname } = req.body;
    if (!nickname?.trim()) return res.status(400).json({ error: '닉네임을 입력해주세요' });

    const { rows } = await query('SELECT * FROM users WHERE nickname = $1', [nickname.trim()]);
    if (rows[0]) return res.json({ user: rows[0] });

    const user = { id: uuid(), nickname: nickname.trim() };
    await query('INSERT INTO users (id, nickname) VALUES ($1, $2)', [user.id, user.nickname]);
    res.json({ user });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// ── Draw ────────────────────────────────────────────────
app.get('/api/draw/status', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'no user' });
    const today = new Date().toISOString().slice(0, 10);
    const { rows } = await query('SELECT 1 FROM daily_draws WHERE user_id=$1 AND draw_date=$2', [userId, today]);
    res.json({ canFreeDraw: rows.length === 0 });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post('/api/draw', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'no user' });

    const today = new Date().toISOString().slice(0, 10);
    const used = await query('SELECT 1 FROM daily_draws WHERE user_id=$1 AND draw_date=$2', [userId, today]);
    if (used.rows.length > 0) return res.status(400).json({ error: '오늘 무료 뽑기를 이미 사용했어요' });

    const { category } = req.body;
    const { rows: talismans } = category
      ? await query('SELECT * FROM talismans WHERE category = $1', [category])
      : await query('SELECT * FROM talismans');
    if (talismans.length === 0) return res.status(400).json({ error: '해당 카테고리 부적이 없어요' });
    const talisman = talismans[Math.floor(Math.random() * talismans.length)];

    const ut = { id: uuid(), user_id: userId, talisman_id: talisman.id, level: 0, status: 'active' };
    await query(
      'INSERT INTO user_talismans (id, user_id, talisman_id, level, status) VALUES ($1,$2,$3,$4,$5)',
      [ut.id, ut.user_id, ut.talisman_id, ut.level, ut.status]
    );
    await query('INSERT INTO daily_draws (user_id, draw_date) VALUES ($1,$2)', [userId, today]);

    res.json({ userTalisman: { ...ut, talisman } });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// ── Inventory ───────────────────────────────────────────
app.get('/api/inventory', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'no user' });

    const { rows } = await query(`
      SELECT ut.*, t.category, t.base_name, t.rarity, t.emoji, t.quote
      FROM user_talismans ut JOIN talismans t ON ut.talisman_id = t.id
      WHERE ut.user_id = $1 AND ut.status != 'broken'
      ORDER BY ut.obtained_at DESC
    `, [userId]);

    res.json({ items: rows });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// ── Enhance ─────────────────────────────────────────────
app.get('/api/enhance/:id/info', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { rows } = await query(
      'SELECT ut.*, t.category, t.base_name, t.rarity, t.emoji, t.quote FROM user_talismans ut JOIN talismans t ON ut.talisman_id=t.id WHERE ut.id=$1 AND ut.user_id=$2',
      [req.params.id, userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'not found' });

    const ut = rows[0];
    res.json({
      userTalisman: ut,
      successRate: SUCCESS_RATES[ut.level] ?? 0,
      destroyRate: DESTROY_RATES[ut.level] ?? 0,
      maxLevel: ut.level >= 9,
    });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post('/api/enhance/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { useSafeTicket = false } = req.body;

    const { rows } = await query(
      'SELECT ut.*, t.category, t.base_name, t.rarity, t.emoji, t.quote FROM user_talismans ut JOIN talismans t ON ut.talisman_id=t.id WHERE ut.id=$1 AND ut.user_id=$2',
      [req.params.id, userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'not found' });
    const ut = rows[0];
    if (ut.status === 'broken') return res.status(400).json({ error: '이미 파괴된 부적이에요' });
    if (ut.level >= 9) return res.status(400).json({ error: '이미 최강화 상태예요' });

    const result = attempt(ut.level, useSafeTicket);

    if (result.destroyed) {
      await query('UPDATE user_talismans SET status=$1, broken_at=NOW() WHERE id=$2', ['broken', ut.id]);
    } else {
      await query('UPDATE user_talismans SET level=$1 WHERE id=$2', [result.newLevel, ut.id]);
    }

    await query(
      'INSERT INTO enhancement_logs (id, user_talisman_id, from_level, to_level, success, destroyed) VALUES ($1,$2,$3,$4,$5,$6)',
      [uuid(), ut.id, ut.level, result.newLevel, result.success, result.destroyed]
    );

    res.json({
      ...result,
      fromLevel: ut.level,
      ashPieces: result.destroyed ? ut.level + 1 : 0,
      talisman: { category: ut.category, base_name: ut.base_name, rarity: ut.rarity, emoji: ut.emoji },
    });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

const PORT = parseInt(process.env.PORT ?? '3461');
initDb()
  .then(() => app.listen(PORT, () => console.log(`boojeok-backend running on :${PORT}`)))
  .catch(err => { console.error('DB init failed:', err); process.exit(1); });
