import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Slot, Stack } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import { PaperProvider } from "react-native-paper";
import { SessionProvider } from "@/auth/ctx";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SessionProvider>
      <PaperProvider>
        {/* <Slot/> */}
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="sign-in" options={{headerShown: true, headerTitle: 'Sign In'}}/>
          <Stack.Screen name="sign-up" options={{headerShown: true, headerTitle: 'Sign Up'}}/>
        </Stack>
      </PaperProvider>
    </SessionProvider>
  );
}
