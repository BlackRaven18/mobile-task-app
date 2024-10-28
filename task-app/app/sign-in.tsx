import HttpClient from '@/api/HttpClient';
import { useSession } from '@/auth/ctx';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Stack } from 'react-native-flex-layout';
import { Button, TextInput } from 'react-native-paper';

export default function SignIn() {
  const { signIn } = useSession();
  const httpClient = new HttpClient();

  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [hidePassword, setHidePassword] = useState(true);

  const handleSignIn = () => {
    httpClient.signIn(login, password)
      .then((response) => {
        SecureStore.setItemAsync('token', response).then(() => {
          signIn();
          router.replace('/');
        })
      });
  }

  return (
    <Stack
      direction='column'
      spacing={10}
      style={{ flex: 1, padding: 20, justifyContent: 'center' }}
    >
      <TextInput
        label="Username"
        value={login}
        onChangeText={(text) => setLogin(text)}
      />
      <TextInput
        secureTextEntry={hidePassword}
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        right={
          <TextInput.Icon
            icon = {hidePassword ? 'eye-off' : 'eye'}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />

      <Button
        mode="contained"
        onPress={handleSignIn}>
        Sign In
      </Button>

    </Stack>
  );
}
