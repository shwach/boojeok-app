import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInventory, getDrawStatus, updateNickname } from '../../lib/api';
import { C, CATEGORY_LABEL, RARITY_LABEL, RARITY_COLOR } from '../../lib/theme';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [canDraw, setCanDraw] = useState(false);
  const [filter, setFilter] = useState('all');
  const [nickname, setNickname] = useState('무명');
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState('');

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('nickname').then(n => n && setNickname(n));
    getInventory().then(d => setItems(d.items ?? []));
    getDrawStatus().then(d => setCanDraw(d.canFreeDraw));
  }, []));

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
  const cat = (key: string) => C[key as keyof typeof C] as any;

  async function handleNicknameUpdate() {
    if (!editName.trim()) return;
    await updateNickname(editName.trim());
    await AsyncStorage.setItem('nickname', editName.trim());
    setNickname(editName.trim());
    setEditModal(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>안녕하세요</Text>
          <Text style={s.headerName}>{nickname} 님 👋</Text>
        </View>
        <TouchableOpacity style={s.avatar} onPress={() => { setEditName(nickname); setEditModal(true); }}>
          <Text style={{ fontSize: 20 }}>🧿</Text>
        </TouchableOpacity>
      </View>

      {/* 닉네임 변경 모달 */}
      <Modal visible={editModal} transparent animationType="fade">
        <View style={s.modalBg}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>닉네임 변경</Text>
            <TextInput
              style={s.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="새 닉네임 입력"
              placeholderTextColor={C.inkLight}
              maxLength={12}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: C.parchment, flex: 1 }]} onPress={() => setEditModal(false)}>
                <Text style={{ color: C.inkLight, fontWeight: '600' }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: C.red, flex: 1 }]} onPress={handleNicknameUpdate}>
                <Text style={{ color: 'white', fontWeight: '700' }}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 뽑기 배너 */}
      <TouchableOpacity style={s.banner} onPress={() => router.push('/(tabs)/draw')} activeOpacity={0.85}>
        <Text style={s.bannerLabel}>{canDraw ? '오늘의 무료 뽑기' : '추가 뽑기'}</Text>
        <Text style={s.bannerTitle}>{canDraw ? '무료 부적 1장 남았어요!' : '티켓으로 뽑을 수 있어요'}</Text>
        <View style={s.bannerBtn}><Text style={s.bannerBtnText}>{canDraw ? '무료 뽑기 →' : '뽑으러 가기 →'}</Text></View>
      </TouchableOpacity>

      {/* 필터 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterWrap}>
        {[['all','전체'],['office','직장인'],['life','일상/생활'],['love','연애/친목']].map(([v,l]) => (
          <TouchableOpacity key={v} onPress={() => setFilter(v)} style={[s.chip, filter===v && s.chipActive]}>
            <Text style={[s.chipText, filter===v && s.chipTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 인벤토리 */}
      <View style={s.invHeader}>
        <Text style={s.invTitle}>보유 부적</Text>
        <Text style={s.invCount}>{filtered.length}장 보유</Text>
      </View>

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🧧</Text>
          <Text style={{ color: C.inkLight, fontSize: 14, textAlign: 'center' }}>
            아직 부적이 없어요{'\n'}
            <Text style={{ color: C.red, fontWeight: '700' }} onPress={() => router.push('/(tabs)/draw')}>무료 뽑기</Text>를 해보세요!
          </Text>
        </View>
      ) : filtered.map(item => (
        <TouchableOpacity key={item.id} style={s.item} onPress={() => router.push(`/enhance/${item.id}`)} activeOpacity={0.8}>
          <View style={[s.itemIcon, { backgroundColor: cat(item.category)?.chip }]}>
            <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={s.itemName} numberOfLines={1}>{item.base_name}</Text>
            <View style={s.itemChips}>
              <View style={[s.badge, { backgroundColor: cat(item.category)?.chip }]}>
                <Text style={[s.badgeText, { color: cat(item.category)?.accent }]}>{CATEGORY_LABEL[item.category]}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: '#F0EAFC' }]}>
                <Text style={[s.badgeText, { color: RARITY_COLOR[item.rarity] }]}>{RARITY_LABEL[item.rarity]}</Text>
              </View>
            </View>
          </View>
          <Text style={s.itemLevel}>+{item.level}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream, paddingHorizontal: 20, paddingTop: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerSub: { fontSize: 12, color: C.inkLight, fontWeight: '500' },
  headerName: { fontSize: 22, fontWeight: '700', color: C.ink },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.parchment, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  banner: { backgroundColor: C.red, borderRadius: 18, padding: 18, marginBottom: 14, overflow: 'hidden' },
  bannerLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,248,240,0.7)', letterSpacing: 0.5, marginBottom: 4 },
  bannerTitle: { fontSize: 17, fontWeight: '700', color: '#FFF8F0', marginBottom: 10 },
  bannerBtn: { backgroundColor: '#F0D97A', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, alignSelf: 'flex-start' },
  bannerBtnText: { color: C.ink, fontSize: 13, fontWeight: '700' },
  filterWrap: { marginBottom: 14 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, backgroundColor: C.parchment, marginRight: 6 },
  chipActive: { backgroundColor: C.red },
  chipText: { fontSize: 12, fontWeight: '700', color: C.inkLight },
  chipTextActive: { color: 'white' },
  invHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  invTitle: { fontSize: 14, fontWeight: '700', color: C.ink },
  invCount: { fontSize: 12, color: C.inkLight },
  empty: { alignItems: 'center', paddingVertical: 40 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { backgroundColor: C.cream, borderRadius: 20, padding: 24, width: '100%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 16, textAlign: 'center' },
  modalInput: { backgroundColor: 'white', borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 12, fontSize: 15, color: C.ink, marginBottom: 16 },
  modalBtn: { borderRadius: 12, padding: 12, alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: 'white', borderRadius: 14, padding: 12, borderWidth: 1.5, borderColor: C.parchment, marginBottom: 8 },
  itemIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 4 },
  itemChips: { flexDirection: 'row', gap: 5 },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  itemLevel: { fontSize: 20, fontWeight: '900', color: C.red },
});
