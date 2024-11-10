import { AuthProvider } from "@/auth/AuthContext";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

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
