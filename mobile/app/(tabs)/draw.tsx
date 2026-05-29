import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { draw, getDrawStatus } from '../../lib/api';
import { C, CATEGORY_LABEL, RARITY_LABEL, RARITY_COLOR } from '../../lib/theme';

export default function Draw() {
  const [canDraw, setCanDraw] = useState<boolean | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  useEffect(() => { getDrawStatus().then(d => setCanDraw(d.canFreeDraw)); }, []);

  async function handleDraw() {
    setLoading(true); setError('');
    try {
      const data = await draw(selectedCat ?? undefined);
      setResult(data.userTalisman);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const cat = (key: string) => C[key as keyof typeof C] as any;

  if (result) {
    const t = result.talisman;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <ScrollView contentContainerStyle={s.resultContent}>
        <Text style={s.resultLabel}>뽑기 결과</Text>
        <Text style={s.resultName}>{t.base_name}</Text>

        <Animated.View style={[s.card, { backgroundColor: cat(t.category)?.bg, borderColor: cat(t.category)?.accent + '22', transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <Text style={{ fontSize: 64, marginBottom: 10 }}>{t.emoji}</Text>
          <Text style={[s.cardName, { color: cat(t.category)?.accent }]}>{t.base_name}</Text>
          <Text style={[s.cardLevel, { color: cat(t.category)?.accent }]}>+0</Text>
          <View style={s.cardChips}>
            <View style={[s.badge, { backgroundColor: cat(t.category)?.chip }]}>
              <Text style={[s.badgeText, { color: cat(t.category)?.accent }]}>{CATEGORY_LABEL[t.category]}</Text>
            </View>
            <View style={[s.badge, { backgroundColor: '#F0EAFC' }]}>
              <Text style={[s.badgeText, { color: RARITY_COLOR[t.rarity] }]}>{RARITY_LABEL[t.rarity]}</Text>
            </View>
          </View>
          {t.quote ? <Text style={[s.quote, { color: cat(t.category)?.accent + '99' }]}>{t.quote}</Text> : null}
        </Animated.View>

        {/* 스탯 */}
        <View style={s.statsRow}>
          {[['시작 단계','+0'],['성공률','90%'],['등급', t.rarity === 'legendary' ? '전설' : t.rarity === 'rare' ? '희귀' : '일반']].map(([l,v]) => (
            <View key={l} style={s.stat}>
              <Text style={s.statLabel}>{l}</Text>
              <Text style={s.statValue}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={s.resultBtns}>
          <TouchableOpacity style={[s.btn, { flex: 1 }]} onPress={() => router.push(`/enhance/${result.id}`)}>
            <Text style={s.btnText}>⚡ 강화하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btnOutline, { flex: 1 }]} onPress={() => router.replace('/(tabs)/home')}>
            <Text style={s.btnOutlineText}>📦 보관하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>부적 뽑기</Text>
      <Text style={s.sub}>오늘의 운명을 뽑아보세요</Text>

      <View style={s.drawBox}>
        <Text style={{ fontSize: 72, marginBottom: 12 }}>🧧</Text>
        <Text style={s.drawBoxTitle}>{canDraw ? '무료 부적 1장 남았어요!' : '오늘 무료 뽑기를 사용했어요'}</Text>
        <Text style={s.drawBoxSub}>카테고리를 선택하거나{'\n'}랜덤으로 받아보세요</Text>
      </View>

      {/* 카테고리 선택 */}
      <View style={s.catWrap}>
        {[
          { key: null,      label: '🎲 랜덤',      sub: '전체' },
          { key: 'office',  label: '💼 직장인',    sub: '회사/업무' },
          { key: 'life',    label: '🌿 일상/생활', sub: '일상/취미' },
          { key: 'love',    label: '💌 연애/친목', sub: '연애/친구' },
        ].map(({ key, label, sub }) => {
          const active = selectedCat === key;
          const cat = key ? C[key as keyof typeof C] as any : null;
          return (
            <TouchableOpacity
              key={String(key)}
              style={[s.catBtn, active && { backgroundColor: cat?.chip ?? C.parchment, borderColor: cat?.accent ?? C.red }]}
              onPress={() => setSelectedCat(key)}
            >
              <Text style={[s.catLabel, active && { color: cat?.accent ?? C.red }]}>{label}</Text>
              <Text style={s.catSub}>{sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!!error && <Text style={s.error}>{error}</Text>}

      <TouchableOpacity
        style={[s.btn, (!canDraw || loading) && s.btnDisabled]}
        onPress={handleDraw}
        disabled={loading || !canDraw}
      >
        <Text style={[s.btnText, (!canDraw || loading) && { color: C.inkLight }]}>
          {loading ? '뽑는 중...' : canDraw ? '🧧 무료 뽑기' : '오늘 이미 뽑았어요'}
        </Text>
      </TouchableOpacity>
      {!canDraw && <Text style={s.rechargeText}>내일 자정에 무료 뽑기가 충전돼요</Text>}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream, paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: C.ink, marginBottom: 6, marginTop: 8 },
  sub: { fontSize: 13, color: C.inkLight, marginBottom: 28 },
  drawBox: { width: '100%', backgroundColor: C.parchment, borderRadius: 20, borderWidth: 1.5, borderColor: C.border, padding: 36, alignItems: 'center', marginBottom: 20 },
  drawBoxTitle: { fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 8, textAlign: 'center' },
  drawBoxSub: { fontSize: 13, color: C.inkLight, textAlign: 'center', lineHeight: 20 },
  error: { fontSize: 13, color: '#C0392B', marginBottom: 12 },
  btn: { width: '100%', backgroundColor: C.red, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: C.parchment },
  btnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  btnOutline: { borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: C.border, backgroundColor: C.parchment },
  btnOutlineText: { color: C.ink, fontSize: 14, fontWeight: '600' },
  rechargeText: { fontSize: 12, color: C.inkLight, marginTop: 8 },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20, width: '100%' },
  catBtn: { flex: 1, minWidth: '45%', backgroundColor: 'white', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: C.border },
  catLabel: { fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2 },
  catSub: { fontSize: 10, color: C.inkLight },
  resultContent: { padding: 20, paddingBottom: 40 },
  resultLabel: { fontSize: 12, fontWeight: '700', color: C.inkLight, letterSpacing: 0.5, marginBottom: 6, textAlign: 'center' },
  resultName: { fontSize: 24, fontWeight: '900', color: C.ink, marginBottom: 16, textAlign: 'center', lineHeight: 28 },
  card: { borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1.5, marginBottom: 16 },
  cardName: { fontSize: 20, fontWeight: '700', marginBottom: 6, lineHeight: 26 },
  cardLevel: { fontSize: 38, fontWeight: '900', lineHeight: 42, marginBottom: 8 },
  cardChips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  quote: { fontSize: 12, fontStyle: 'italic', marginTop: 8, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  stat: { flex: 1, backgroundColor: 'white', borderRadius: 14, padding: 10, alignItems: 'center', borderWidth: 1.5, borderColor: C.parchment },
  statLabel: { fontSize: 10, fontWeight: '700', color: C.inkLight, letterSpacing: 0.5, marginBottom: 4 },
  statValue: { fontSize: 17, fontWeight: '700', color: C.ink },
  resultBtns: { flexDirection: 'row', gap: 8 },
});
