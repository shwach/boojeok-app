import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../../lib/theme';

export default function Ranking() {
  return (
    <SafeAreaView style={s.container}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>🏆</Text>
      <Text style={s.title}>랭킹</Text>
      <Text style={s.sub}>곧 오픈 예정이에요!{'\n'}강화 고수들의 순위를{'\n'}여기서 볼 수 있어요</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: C.ink, marginBottom: 8 },
  sub: { fontSize: 14, color: C.inkLight, textAlign: 'center', lineHeight: 22 },
});
