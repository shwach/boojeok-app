import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { C } from '../lib/theme';

export default function Index() {
  useEffect(() => {
    AsyncStorage.getItem('userId').then(id => {
      if (id) router.replace('/(tabs)/home');
      else router.replace('/onboarding');
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.cream }}>
      <ActivityIndicator color={C.red} />
    </View>
  );
}
