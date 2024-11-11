import { useAuth } from "@/auth/AuthContext";
import AppHeaderMenu from "@/components/AppHeaderMenu";
import { Redirect, router, Stack } from "expo-router";
import { Appbar } from "react-native-paper";


export default function AppLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <>
      <Appbar.Header>
        {router.canGoBack() && <Appbar.BackAction onPress={() => { router.back() }} />}
        <Appbar.Content title="Task App" />
        <AppHeaderMenu />
      </Appbar.Header>

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="task-list-details" options={{ headerShown: false }} />
        <Stack.Screen name="add-task" options={{ headerShown: false }} />
        <Stack.Screen name="edit-task" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}