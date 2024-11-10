import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/auth/AuthContext";
import { Appbar } from "react-native-paper";
import CustomDrawer from "@/components/CustomDrawer";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AppLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Task App" />
        <Appbar.Action icon="logout" onPress={() => { }} />
        <Appbar.Action icon="account" onPress={() => { }} />
        <Appbar.Action icon="menu" onPress={() => { }} />
      </Appbar.Header>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
      </Stack>
    </>
  )
}