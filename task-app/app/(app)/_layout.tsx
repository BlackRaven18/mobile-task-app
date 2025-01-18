import AppHeaderMenu from "@/components/AppHeaderMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useSync } from "@/contexts/SyncContext";
import { Redirect, router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ActivityIndicator, Appbar, MD3Colors, Portal } from "react-native-paper";


export default function AppLayout() {
  const { isSignedIn } = useAuth();
  const { isSyncing, sync } = useSync()
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSyncing) {

      timer = setTimeout(() => {
        setShowBackdrop(true);
      }, 300);
    } else {

      setShowBackdrop(false);
    }

    return () => clearTimeout(timer);
  }, [isSyncing]);

  useEffect(() => {
    if (isSignedIn) {
      sync()
        .then(() => {
          console.log("Sync complete");
        })
        .catch(error => console.log(error))
    }
  }, [isSignedIn])

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

      <Portal>
        {showBackdrop && (
          <View style={styles.backdrop}>
            <ActivityIndicator animating={true} size={60} color={MD3Colors.primary50} style={{ marginBottom: 20 }} />
            <Text style={{ fontSize: 20, color: 'white' }}>Synchronizing data...</Text>
          </View>
        )}
      </Portal>

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="task-list-details" options={{ headerShown: false }} />
        <Stack.Screen name="add-task" options={{ headerShown: false }} />
        <Stack.Screen name="edit-task" options={{ headerShown: false }} />
      </Stack>

    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
