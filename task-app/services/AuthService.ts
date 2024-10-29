import HttpClient from '@/api/HttpClient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default class AuthService {

    static async clearSecureStorage() {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
    }

    static async signOut() {
        await this.clearSecureStorage();
        router.replace('/sign-in');
        console.log("Signed out");
    }
}