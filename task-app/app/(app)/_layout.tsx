import { useAuth } from "@/auth/AuthContext";
import AppHeaderMenu from "@/components/AppHeaderMenu";
import * as AsyncStorageService from "@/services/AsyncStorageService";
import { performSync } from "@/services/SyncService";
import { getCurrentDateTime } from "@/utils/date";
import { Redirect, router, Stack } from "expo-router";
import { openDatabaseSync } from "expo-sqlite";
import React, { useEffect } from "react";
import { Appbar } from "react-native-paper";


export default function AppLayout() {
  const { isSignedIn, username } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  useEffect(() => {
    syncData(username);
  }, [])

  const syncData = (username: string) => {
    const db = openDatabaseSync('test.db');

    AsyncStorageService.getData('lastSync')
      .then((value) => {
        const lastSync = value ?? '1970-01-01 12:00:00';
        console.log('lastSync: ', lastSync);

        performSync(db, lastSync, username)
          .then(() => {
            const currentDateTime = getCurrentDateTime();
            // AsyncStorageService.storeData('lastSync', currentDateTime);
            console.log("Sync complete, updated lastSync to: ", currentDateTime);
          })
      })
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