import HttpClient from "@/api/HttpClient";
import { useAuth } from "@/auth/AuthContext";
import TaskCheckboxItem from "@/components/TaskCheckboxItem";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Divider, IconButton, List, MD3Colors, Portal, Snackbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from 'react-native-flex-layout';


export default function Index() {
  const { username } = useAuth();

  const httpClient = new HttpClient();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const onToggleSnackBar = () => setVisible(!visible);

  const getTaskLists = () => {
    httpClient.getAllTaskLists(username)
      .then((taskLists) => {
        setTaskLists(taskLists);
      })
      .catch((error) => {
        console.log(error);
      })
  }


  useEffect(() => {
    getTaskLists();
  }, [])

  useFocusEffect(
    useCallback(() => {
    }, [])
  );

  // const refresh = () => {
  //   getTasks();
  // }

  // const afterTaskDeleteCallback = (message: string) => {
  //   refresh();
  //   setMessage(message);
  //   setVisible(true);
  // }



  return (
    <View style={{ flex: 1 }}>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 15,
        marginBottom: 10
      }}
      >
        <Text style={{ fontSize: 24 }}> Twoje notatki</Text>

      </View>

      <Divider style={{ marginHorizontal: 10 }} />

      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={taskLists}
          renderItem={({ item }) => (
            <Stack direction="row" style={{ flex: 1, padding: 10 }}>
              <List.Icon color={MD3Colors.tertiary70} icon="note-edit" />
              <Link
                href={{
                  pathname: '/task-list-details',
                  params: { 
                    id: item.id,
                    title: item.title
                  }
                }}
                asChild
              >
                <List.Item
                  title={item.title}
                  onPress={() => { console.log("Pressed") }}
                  style={{ flex: 1 }}
                />
              </Link>
            </Stack>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </SafeAreaView>

      {/* <SafeAreaView style={{ flex: 1 }}>
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
      </SafeAreaView> */}



      <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', padding: 10 }}>
        <Link href="/add-task-list" asChild>
          <IconButton
            icon="plus"
            mode="contained"
            iconColor={MD3Colors.tertiary50}
            size={20}

          />
        </Link>

      </View>

      <Portal.Host>
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
      </Portal.Host>
    </View>
  );
}
