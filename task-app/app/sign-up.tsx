import HttpClient from '@/api/HttpClient';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Divider, Text, TextInput } from 'react-native-paper';


export default function SignUp() {

    const httpClient = new HttpClient();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [error, setError] = useState('');

    const validatePassword = () => {

        if (password.length === 0 || repeatedPassword.length === 0) {
            setError('Hasło jest wymagane');
            return false;
        }

        if (password.length < 6 || repeatedPassword.length < 6) {
            setError('Hasło musi mieć conajmniej 6 znaków');
            return false;
        }

        if (password !== repeatedPassword) {
            setError('Hasła nie pasują do siebie');
            return false;
        }
        
        setError('');
        return true;
    }

    const validateLogin = () => {

        if (login.length < 3) {
            setError('Login musi mieć minimum 3 znaki');
            return false;
        }

        setError('');
        return true;
    }

    const handleSignUp = () => {

        if (!validateLogin()) {
            return;
        }

        if (!validatePassword()) {
            return;
        }


        httpClient.signUp(login, password)
            .then((response) => {
                console.log(response)
                router.back()
            })
            .catch((error) => {
                setError(error);
                console.log(error);
            })
    }

    return (
        <View style={{ flex: 1, gap: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontSize: 24 }}>Rejestracja</Text>

            <Divider style={{ width: '80%', marginBottom: 10 }} />

            <View style={{ width: '90%', gap: 10 }}>
                <TextInput
                    label="Login"
                    value={login}
                    onChangeText={text => setLogin(text)}
                />
                <TextInput
                    label="Hasło"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry={hidePassword}
                    right={
                        <TextInput.Icon
                            icon={hidePassword ? 'eye-off' : 'eye'}
                            onPress={() => setHidePassword(!hidePassword)}
                        />
                    }
                />
                <TextInput
                    label="Powtórz hasło"
                    value={repeatedPassword}
                    onChangeText={text => setRepeatedPassword(text)}
                    secureTextEntry={hidePassword}
                    right={
                        <TextInput.Icon
                            icon={hidePassword ? 'eye-off' : 'eye'}
                            onPress={() => setHidePassword(!hidePassword)}
                        />
                    }
                />
            </View>
            <Button
                mode="contained"
                onPress={handleSignUp}
            >
                Zarejestruj się
            </Button>
            <Text style={{ color: 'red' }}>{error}</Text>
        </View>
    )
}