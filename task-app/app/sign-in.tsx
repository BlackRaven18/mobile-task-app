import HttpClient from '@/api/HttpClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AuthService from '@/services/AuthService';
import { useState } from 'react';
import { Stack } from 'react-native-flex-layout';
import { Button, Divider, Text, TextInput } from 'react-native-paper';

export default function SignIn() {
  const { signIn } = useAuth();
  const httpClient = new HttpClient();

  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState('');

  const handleSignIn = () => {
    httpClient.signIn(login, password)
      .then((response) => {
        const { accessToken, refreshToken } = response;

        Promise.all([
          SecureStore.setItemAsync('accessToken', accessToken),
          SecureStore.setItemAsync('refreshToken', refreshToken),
        ])
          .then(() => {
            console.log('Sign in successful');
            AuthService.decodeToken(accessToken);
            signIn();
          }).catch((error) => {
            console.log(error);
            setMessage("Invalid credentials");
          })

      }).catch((error) => {
        setMessage("Sign-in failed. Please try again.");
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
