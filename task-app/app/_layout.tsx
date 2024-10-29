import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Slot, Stack } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import { PaperProvider } from "react-native-paper";
import { SessionProvider } from "@/auth/ctx";
import { AuthProvider } from "@/auth/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="sign-in" options={{ headerShown: true, headerTitle: 'Sign In' }} />
          <Stack.Screen name="sign-up" options={{ headerShown: true, headerTitle: 'Sign Up' }} />
        </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}
