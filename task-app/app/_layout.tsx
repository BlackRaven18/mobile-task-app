import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <PaperProvider>
    
        <Stack>
          <Stack.Screen name="login" />
          <Stack.Screen name="index" options={{ headerTitle: "Task App" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
    </PaperProvider>
  );
}
