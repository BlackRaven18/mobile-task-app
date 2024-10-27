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
        <Slot />
      </PaperProvider>
    </SessionProvider>
    // <PaperProvider>
    //     <Stack>
    //       <Stack.Screen name="sign-in" />
    //       <Stack.Screen name="+not-found" />
    //     </Stack>
    // </PaperProvider>
  );
}
