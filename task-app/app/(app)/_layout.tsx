import { useAuth } from "@/auth/AuthContext";
import AppHeaderMenu from "@/components/AppHeaderMenu";
import * as AsyncStorageService from "@/services/AsyncStorageService";
import { performSync } from "@/services/SyncService";
import { getCurrentDateTime } from "@/utils/date";
import { Redirect, router, Stack } from "expo-router";
import { openDatabaseSync } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Appbar, MD2Colors, MD3Colors } from "react-native-paper";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function AppLayout() {
  const { isSignedIn, username } = useAuth();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      syncData(username)
      .then(() => setIsSyncing(false))
      .catch(error => console.log(error))
    }
  }, [isSignedIn])

  const syncData = async (username: string) => {
    const db = openDatabaseSync('test.db');

    const lastSync =  await AsyncStorageService.getData('lastSync') ?? '1970-01-01 12:00:00';
    await performSync(db, lastSync, username)

    const currentDateTime = getCurrentDateTime();
    await AsyncStorageService.storeData('lastSync', currentDateTime);
    console.log("Sync complete, updated lastSync to: ", currentDateTime);

  }

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

      {isSyncing ? (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={true} size={60} color={MD3Colors.primary50} style={{ marginBottom: 20 }} />
          <Text style={{ fontSize: 20 }}>Synchronizing data...</Text>
        </View>

      ) : (

        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="task-list-details" options={{ headerShown: false }} />
          <Stack.Screen name="add-task" options={{ headerShown: false }} />
          <Stack.Screen name="edit-task" options={{ headerShown: false }} />
        </Stack>

      )}
    </>
  )
}

function useCallback(arg0: (username: string) => Promise<void>, arg1: never[]) {
  throw new Error("Function not implemented.");
}
