import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guestLogin } from '../lib/api';
import { C } from '../lib/theme';

export default function Onboarding() {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!nickname.trim()) { Alert.alert('닉네임을 입력해주세요'); return; }
    setLoading(true);
    try {
      const { user } = await guestLogin(nickname.trim());
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('nickname', user.nickname);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      Alert.alert('오류', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* 히어로 */}
      <View style={s.hero}>
        <Text style={s.heroEmoji}>🧧</Text>
        <Text style={s.heroTitle}>오늘의 스트레스,{'\n'}부적 한 장으로 해결</Text>
        <Text style={s.heroSub}>상황별 밈 부적을 뽑고{'\n'}강화해서 친구에게 자랑하세요</Text>
      </View>

      {/* 도트 */}
      <View style={s.dots}>
        {[true, false, false].map((on, i) => (
          <View key={i} style={[s.dot, on && s.dotActive]} />
        ))}
      </View>

      <Text style={s.title}>부적발급소에{'\n'}오신 것을 환영합니다</Text>
      <Text style={s.sub}>닉네임을 정해주세요</Text>

      <TextInput
        style={s.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="예: 직장인무당, 월급루팡"
        placeholderTextColor={C.inkLight}
        maxLength={12}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />

      {/* 약관 */}
      <View style={s.terms}>
        {['[필수] 오락용 콘텐츠 고지 동의', '[필수] 이용약관 및 개인정보처리', '[선택] 마케팅 수신 동의'].map((t, i) => (
          <View key={t} style={s.termRow}>
            <View style={[s.checkbox, i < 2 && s.checkboxOn]}>
              {i < 2 && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={[s.termText, i >= 2 && { color: C.inkLight }]}>{t}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleSubmit} disabled={loading}>
        <Text style={s.btnText}>{loading ? '잠시만요...' : '부적 받으러 가기 🔥'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream },
  content: { padding: 24, paddingBottom: 40 },
  hero: { backgroundColor: C.parchment, borderRadius: 18, padding: 28, alignItems: 'center', marginBottom: 20, borderWidth: 1.5, borderColor: C.border },
  heroEmoji: { fontSize: 56, marginBottom: 12 },
  heroTitle: { fontWeight: '700', fontSize: 17, color: C.ink, textAlign: 'center', marginBottom: 6, lineHeight: 24 },
  heroSub: { fontSize: 12, color: C.inkLight, textAlign: 'center', lineHeight: 19 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginBottom: 22 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  dotActive: { width: 22, borderRadius: 4, backgroundColor: C.red },
  title: { fontSize: 22, fontWeight: '700', color: C.ink, lineHeight: 28, marginBottom: 6 },
  sub: { fontSize: 13, color: C.inkLight, marginBottom: 16 },
  input: { backgroundColor: 'white', borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 14, fontSize: 15, color: C.ink, marginBottom: 16 },
  terms: { marginBottom: 20 },
  termRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.parchment },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: C.red, borderColor: C.red },
  checkmark: { color: 'white', fontSize: 10, fontWeight: '700' },
  termText: { fontSize: 12, color: C.ink },
  btn: { backgroundColor: C.red, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
