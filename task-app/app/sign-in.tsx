import HttpClient from '@/api/HttpClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AuthService from '@/services/AuthService';
import { useEffect, useState } from 'react';
import { Stack } from 'react-native-flex-layout';
import { Button, Divider, Text, TextInput } from 'react-native-paper';
import { View } from 'react-native';

export default function SignIn() {
	const { signIn } = useAuth();
	const httpClient = new HttpClient();

	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [hidePassword, setHidePassword] = useState(true);
	const [message, setMessage] = useState('');

	useEffect(() => {
		setMessage('');
	}, [])

	const handleSignIn = () => {
		httpClient.signIn(login, password)
			.then((response) => {
				const { accessToken, refreshToken } = response;

				Promise.all([
					SecureStore.setItemAsync('accessToken', accessToken),
					SecureStore.setItemAsync('refreshToken', refreshToken),
				])
					.then(() => {
						console.log('Logowanie udane');
						AuthService.decodeToken(accessToken);
						signIn();
					}).catch((error) => {
						console.log(process.env.BACKEND_API_URL)
						console.log(error);
						setMessage("Złe dane logowania");
					})

			}).catch((error) => {
				setMessage("Nieudane logowanie. Spróbuj ponownie.");
			});
	}

	return (
		<View
			style={{
				flex: 1,
				padding: 20,
				gap: 10,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Text style={{ fontSize: 24 }}>
				Zaloguj się
			</Text>

			<Divider style={{ width: '90%', marginBottom: 20 }} />

			<View style={{ width: '100%', gap: 10 }}>
				<TextInput
					label="Login"
					value={login}
					onChangeText={(text) => setLogin(text)}
				/>
				<TextInput
					secureTextEntry={hidePassword}
					label="Hasło"
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
					Zaloguj się
				</Button>
			</View>
			<Text style={{ color: 'red' }}>{message}</Text>

			<Divider style={{ margin: 15, width: '100%' }} />

			<Stack spacing={20} style={{ alignItems: 'center' }}>
				<Text> Nie masz konta? Nie ma problemu!</Text>

				<Link href="/sign-up" asChild>
					<Button
						mode="contained"
					>
						Zarejestruj sie
					</Button>
				</Link>
			</Stack>
		</View>
	);
}
