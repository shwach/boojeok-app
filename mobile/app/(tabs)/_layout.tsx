import { Tabs } from 'expo-router';
import { C } from '../../lib/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: C.cream, borderTopColor: C.border, height: 60, paddingBottom: 8 },
      tabBarActiveTintColor: C.red,
      tabBarInactiveTintColor: C.inkLight,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
    }}>
      <Tabs.Screen name="home" options={{ title: '홈', tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} /> }} />
      <Tabs.Screen name="draw" options={{ title: '뽑기', tabBarIcon: ({ color }) => <TabIcon emoji="🧧" color={color} /> }} />
      <Tabs.Screen name="ranking" options={{ title: '랭킹', tabBarIcon: ({ color }) => <TabIcon emoji="🏆" color={color} /> }} />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, opacity: color === C.red ? 1 : 0.5 }}>{emoji}</Text>;
}
