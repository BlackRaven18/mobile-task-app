import { Redirect, Stack } from "expo-router";
import { Text } from "react-native-paper";

import { useSession } from "@/auth/ctx";
import { useAuth } from "@/auth/AuthContext";

export default function AppLayout() {
  const { isSignedIn } = useAuth();
  // const { session, isLoading } = useSession();

  // // You can keep the splash screen open, or render a loading screen like we do here.
  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  // // Only require authentication within the (app) group's layout as users
  // // need to be able to access the (auth) group and sign in again.
  if (!isSignedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerTitle: 'Task App'}}/>
    </Stack>
  )
}