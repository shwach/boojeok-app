import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { C } from '../lib/theme';
import { autoLogin } from '../lib/api';

function generateDeviceId() {
  return 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Index() {
  useEffect(() => {
    (async () => {
      try {
        // 이미 로그인된 경우
        const userId = await AsyncStorage.getItem('userId');
        if (userId) { router.replace('/(tabs)/home'); return; }

        // 첫 실행: deviceId 생성 후 자동 가입
        let deviceId = await AsyncStorage.getItem('deviceId');
        if (!deviceId) {
          deviceId = generateDeviceId();
          await AsyncStorage.setItem('deviceId', deviceId);
        }

        const { user } = await autoLogin(deviceId);
        await AsyncStorage.setItem('userId', user.id);
        await AsyncStorage.setItem('nickname', user.nickname);
        router.replace('/(tabs)/home');
      } catch (e) {
        // 오프라인 등 실패 시 홈으로 그냥 이동
        router.replace('/(tabs)/home');
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.cream }}>
      <ActivityIndicator color={C.red} size="large" />
    </View>
  );
}
