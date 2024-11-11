import HttpClient from "@/api/HttpClient";
import { useAuth } from "@/auth/AuthContext";
import AddTaskModal from "@/components/AddTaskModal";
import TaskListEntry from "@/components/TaskListEntry";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Stack } from 'react-native-flex-layout';
import { Dialog, Divider, IconButton, List, MD3Colors, Portal, Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  const { username } = useAuth();

  const httpClient = new HttpClient();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [visible, setVisible] = useState(false);

  const openDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);


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

  const refresh = () => {
    getTaskLists();
  }


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
            <TaskListEntry id={item.id} title={item.title} refresh={refresh}/>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </SafeAreaView>

      <AddTaskModal refresh={refresh} />


    </View >
  );
}
