import HttpClient from '@/api/HttpClient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Stack } from 'react-native-flex-layout';
import { Button, Text, TextInput } from 'react-native-paper';


export default function SignUp() {

    const httpClient = new HttpClient();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);

    const validatePassword = () => {
        return password === repeatedPassword;
    }

    const handleSignUp = () => {

        if (!validatePassword()) {
            alert('Passwords do not match');
            return;
        }

        httpClient.signUp(login, password)
            .then((response) => {
                router.back()
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <Stack spacing={10} style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <Text>
                Create Account
            </Text>
            <TextInput
                label="Login"
                value={login}
                onChangeText={text => setLogin(text)}
            />
            <TextInput
                label="Password"
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
                label="Repeat Password"
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
            <Button
                mode='contained'
                onPress={handleSignUp}
            >
                Register
            </Button>

        </Stack>
    )
}