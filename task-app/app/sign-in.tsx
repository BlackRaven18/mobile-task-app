import HttpClient from '@/api/HttpClient';
import { useSession } from '@/auth/ctx';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Stack } from 'react-native-flex-layout';
import { Button, TextInput, Text, Divider } from 'react-native-paper';

export default function SignIn() {
  const { signIn } = useSession();
  const httpClient = new HttpClient();

  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState('');

  const handleSignIn = () => {
    httpClient.signIn(login, password)
      .then((response) => {
        SecureStore.setItemAsync('token', response).then(() => {
          signIn();
          router.replace('/');
        })
        .catch((error) => {
          setMessage("Invalid credentials");
          console.log("bebe");
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
            icon={hidePassword ? 'eye-off' : 'eye'}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />

      <Button
        mode="contained"
        onPress={handleSignIn}>
        Sign In
      </Button>
      <Text style={{ color: 'red' }}>{message}</Text>

      <Divider style={{ margin: 20 }} />

      <Stack spacing={20} style={{ alignItems: 'center' }}>
        <Text> You don't have account? No problem!</Text>

        <Link href="/sign-up" asChild>
          <Button
            mode="contained"
          >
            Create Account
          </Button>
        </Link>
      </Stack>


    </Stack>
  );
}
