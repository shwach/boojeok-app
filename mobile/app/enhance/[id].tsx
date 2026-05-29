import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getEnhanceInfo, enhance } from '../../lib/api';
import { C, CATEGORY_LABEL } from '../../lib/theme';

const SUCCESS_RATES: Record<number, number> = { 0:.9,1:.75,2:.6,3:.45,4:.3,5:.2,6:.12,7:.07,8:.03 };
const DESTROY_RATES: Record<number, number> = { 7:.35,8:.5 };

type Result = { success: boolean; destroyed: boolean; newLevel: number; fromLevel: number; ashPieces: number; talisman: any };

export default function Enhance() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const shakeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => { if (id) getEnhanceInfo(id).then(setInfo); }, [id]);

  async function handleEnhance(useSafeTicket = false) {
    if (!id) return;
    setLoading(true);
    try {
      const r = await enhance(id, useSafeTicket);
      setResult(r);
      if (!r.success) {
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!info) return <View style={s.loading}><Text style={{ color: C.inkLight }}>불러오는 중...</Text></View>;

  const { userTalisman: ut } = info;
  const level = ut.level;
  const successPct = Math.round((SUCCESS_RATES[level] ?? 0) * 100);
  const destroyPct = Math.round((DESTROY_RATES[level] ?? 0) * 100);
  const cat = C[ut.category as keyof typeof C] as any;

  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <ScrollView contentContainerStyle={s.content}>
        {/* 헤더 */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <Text style={s.title}>강화하기</Text>
        </View>

        {/* 부적 + 링 */}
        <View style={{ alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontSize: 12, color: C.inkLight, marginBottom: 10 }}>{ut.base_name}</Text>
          <View style={s.ringWrap}>
            <View style={[s.ringBg, { borderColor: C.parchment }]} />
            <View style={[s.ringFill, { borderColor: C.red, opacity: (level / 9) }]} />
            <View style={s.ringCenter}>
              <Text style={s.levelNum}>+{level}</Text>
              <Text style={s.levelSub}>현재 단계</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 22 }}>{ut.emoji}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.rare }}>→ +{level + 1} 도전</Text>
          </View>
        </View>

        {/* 확률 카드 */}
        <View style={s.card}>
          <View style={{ marginBottom: 10 }}>
            <View style={s.barHeader}>
              <Text style={s.barLabel}>성공 확률</Text>
              <Text style={[s.barValue, { color: C.red }]}>{successPct}%</Text>
            </View>
            <View style={s.barBg}>
              <View style={[s.barFill, { width: `${successPct}%`, backgroundColor: C.red }]} />
            </View>
          </View>
          {destroyPct > 0 && (
            <View>
              <View style={s.barHeader}>
                <Text style={s.barLabel}>실패 시 파괴 확률</Text>
                <Text style={[s.barValue, { color: '#C0392B' }]}>{destroyPct}%</Text>
              </View>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: `${destroyPct}%`, backgroundColor: '#C0392B' }]} />
              </View>
            </View>
          )}
          {level >= 4 && level < 7 && (
            <Text style={{ fontSize: 11, color: C.inkLight, marginTop: 8 }}>실패 시 1단계 하락</Text>
          )}
        </View>

        {/* 비용 */}
        <View style={[s.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }]}>
          <View>
            <Text style={s.costLabel}>강화 비용</Text>
            <Text style={s.costValue}>🔮 강화석 × {(level + 1) * 20}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.costLabel}>보유량</Text>
            <Text style={{ fontSize: 18, fontWeight: '900', color: C.ink }}>280개</Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={() => handleEnhance(false)} disabled={loading}>
            <Text style={s.btnText}>{loading ? '강화 중...' : '⚡ 강화하기'}</Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={s.btnOutline} onPress={() => handleEnhance(true)} disabled={loading}>
          <Text style={s.btnOutlineText}>🛡 안전강화권 사용</Text>
        </TouchableOpacity>
        <Text style={s.safeNote}>안전강화권: 실패 시 파괴 면제, 1단계 하락</Text>
      </ScrollView>

      {/* 결과 모달 */}
      <Modal visible={!!result} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />

            {result?.success ? (
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 60, marginBottom: 8 }}>⚡</Text>
                <Text style={[s.modalTitle, { color: C.success }]}>강화 성공!</Text>
                <Text style={[s.modalLevel, { color: C.red }]}>+{result.newLevel}</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 8 }}>{result.talisman.base_name}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                  <View style={[s.badge, { backgroundColor: (C[result.talisman.category as keyof typeof C] as any)?.chip }]}>
                    <Text style={[s.badgeText, { color: (C[result.talisman.category as keyof typeof C] as any)?.accent }]}>{CATEGORY_LABEL[result.talisman.category]}</Text>
                  </View>
                  <View style={[s.badge, { backgroundColor: '#D0F0DC' }]}>
                    <Text style={[s.badgeText, { color: C.success }]}>↑ +{result.newLevel} 달성</Text>
                  </View>
                </View>
                {result.newLevel >= 7 && <Text style={{ fontSize: 12, color: C.inkLight, fontStyle: 'italic' }}>"상위 강화자 달성!"</Text>}
              </View>
            ) : result?.destroyed ? (
              <View style={{ alignItems: 'center', marginBottom: 14 }}>
                <Text style={{ fontSize: 60, marginBottom: 8 }}>💥</Text>
                <Text style={[s.modalTitle, { color: C.red }]}>부적이 파괴되었습니다</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 4 }}>+{result.fromLevel} {result.talisman.base_name}</Text>
                <Text style={{ fontSize: 12, color: C.inkLight, marginBottom: 12 }}>+{result.fromLevel + 1} 도전에서 터졌어요 😭</Text>
                <View style={s.ashBox}>
                  <Text style={{ fontSize: 24 }}>🌑</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>파괴 보상</Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>재의 조각 × {result.ashPieces}개 획득</Text>
                  </View>
                </View>
                <View style={s.ashTip}><Text style={{ fontSize: 11, color: C.inkLight }}>💡 조각 20개 = 랜덤 부적 재뽑기</Text></View>
              </View>
            ) : (
              <View style={{ alignItems: 'center', marginBottom: 14 }}>
                <Text style={{ fontSize: 60, marginBottom: 8 }}>😓</Text>
                <Text style={[s.modalTitle, { color: C.inkLight }]}>강화 실패</Text>
                <Text style={{ fontSize: 13, color: C.inkLight, marginBottom: 12 }}>
                  {result && result.newLevel < result.fromLevel ? `+${result.fromLevel} → +${result.newLevel} 하락` : `+${result?.fromLevel} 유지`}
                </Text>
              </View>
            )}

            <TouchableOpacity style={s.btn} onPress={() => {
              setResult(null);
              if (result?.destroyed) router.replace('/(tabs)/home');
              else if (id) getEnhanceInfo(id).then(setInfo);
            }}>
              <Text style={s.btnText}>
                {result?.destroyed ? '🧧 다시 뽑으러 가기' : result?.success ? '⚡ 한 번 더 강화!' : '다시 도전'}
              </Text>
            </TouchableOpacity>
            {result?.success && (
              <TouchableOpacity style={[s.btnOutline, { marginTop: 8 }]} onPress={() => router.replace('/(tabs)/home')}>
                <Text style={s.btnOutlineText}>홈으로 돌아가기</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.cream },
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: C.inkLight },
  title: { fontSize: 20, fontWeight: '700', color: C.ink },
  ringWrap: { width: 116, height: 116, marginBottom: 10, alignItems: 'center', justifyContent: 'center' },
  ringBg: { position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 10, borderColor: C.parchment },
  ringFill: { position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 10 },
  ringCenter: { alignItems: 'center' },
  levelNum: { fontSize: 32, fontWeight: '900', color: C.red, lineHeight: 36 },
  levelSub: { fontSize: 10, color: C.inkLight, fontWeight: '500' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: C.parchment, marginBottom: 10 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  barLabel: { fontSize: 12, color: C.inkLight },
  barValue: { fontSize: 12, fontWeight: '700' },
  barBg: { height: 8, backgroundColor: C.parchment, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  costLabel: { fontSize: 10, fontWeight: '700', color: C.inkLight, letterSpacing: 0.5, marginBottom: 2 },
  costValue: { fontSize: 14, fontWeight: '700', color: C.ink },
  btn: { backgroundColor: C.red, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 8 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  btnOutline: { backgroundColor: C.parchment, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: C.border, marginBottom: 8 },
  btnOutlineText: { color: C.ink, fontSize: 14, fontWeight: '600' },
  safeNote: { textAlign: 'center', fontSize: 11, color: C.inkLight, lineHeight: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.cream, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingBottom: 40 },
  modalHandle: { width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  modalLevel: { fontSize: 44, fontWeight: '900', lineHeight: 50, marginBottom: 8 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  ashBox: { backgroundColor: '#2C1810', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, width: '100%' },
  ashTip: { backgroundColor: C.parchment, borderRadius: 10, padding: 8, width: '100%', alignItems: 'center' },
});
