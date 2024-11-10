import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface JwtExtendedPayload extends JwtPayload {
    username: string;
}

export default class AuthService {

    static async clearSecureStorage() {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('username');
    }

    static decodeToken(token: string): void {
        const decodedToken = jwtDecode<JwtExtendedPayload>(token);
        SecureStore.setItem('username', decodedToken.username);
        console.log(decodedToken)
    }

    static async signOut() {
        await this.clearSecureStorage();
        router.replace('/sign-in');
        console.log("Signed out");
    }

    static getUsername() {
        return SecureStore.getItem('username');
    }
}