import { router } from 'expo-router';
import { Text, View } from 'react-native';

import HttpClient from '@/api/HttpClient';
import { useSession } from '@/auth/ctx';
import { setStorageItemAsync } from '@/auth/useStorageState';
import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

export default function SignIn() {
  const { signIn } = useSession();
  const httpClient = new HttpClient();

  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('admin');

  return (
    <View style={{ padding: 20, justifyContent: 'center' }}>
      <TextInput
        label="Username"
        onChangeText={(text) => setLogin(text)}
      />
      <TextInput
        label="Password"
        onChangeText={(text) => setPassword(text)}
      />
      <Text
        onPress={() => {
          httpClient.signIn(login, password)
            .then((response) => {
              SecureStore.setItem('token', response);
            });
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/');
        }}>
        Sign In
      </Text>
    </View>
  );
}
