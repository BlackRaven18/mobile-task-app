import TaskCheckboxItem from "@/components/TaskCheckboxItem";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { IconButton, MD3Colors, Portal, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import HttpClient from "../api/HttpClient";


export default function Index() {

  const httpClient = new HttpClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const onToggleSnackBar = () => setVisible(!visible);

  const getTasks = () => {
    httpClient.getTasks().then((tasks) => {
      setTasks(tasks);
    })
      .catch((error) => {
        setTasks([]);
        console.error(error);
      })
  }

  useEffect(() => {
    getTasks();
  }, [])

  useFocusEffect(
    useCallback(() => {
      getTasks();
    }, [])
  );

  const refresh = () => {
    getTasks();
  }

  const afterTaskDeleteCallback = (message: string) => {
    refresh();
    setMessage(message);
    setVisible(true);
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <TaskCheckboxItem
              id={item.id} 
              label={item.description} 
              afterDeleteCallback={afterTaskDeleteCallback}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </SafeAreaView>



      <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', padding: 10 }}>
        <Link href="/add-task" asChild>
          <IconButton
            icon="plus"
            mode="contained"
            iconColor={MD3Colors.tertiary50}
            size={20}

          />
        </Link>
      </View>

      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={onToggleSnackBar}
          duration={2000}
          action={{
            label: 'Close',
            onPress: () => {
              onToggleSnackBar();
            },
          }}>
          {message}
        </Snackbar>
      </Portal>
    </View>
  );
}
