import HttpClient from "@/api/HttpClient";
import { useAuth } from "@/auth/AuthContext";
import { useFocusEffect, Link, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import { Divider, List, MD3Colors, IconButton, Portal, Snackbar, Text } from "react-native-paper";
import { Stack } from 'react-native-flex-layout';
import TaskCheckboxItem from "@/components/TaskCheckboxItem";

interface TaskListDetailsScreenParams {
    id: number
    title: string
}

function EmptyTaskList() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Lista jest pusta, dodaj pierwszy wpis!</Text>
        </View>
    )
}

export default function TaskListDetailsScreen() {
    const { username } = useAuth();

    const params: TaskListDetailsScreenParams = useLocalSearchParams();

    const httpClient = new HttpClient();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const onToggleSnackBar = () => setVisible(!visible);



    const getTasks = () => {
        httpClient.getTasks(params.id)
            .then((tasks) => {
                setTasks(tasks);
            })
            .catch((error) => {
                setTasks([]);
                console.log(error);
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
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                marginTop: 15,
                marginBottom: 10
            }}
            >
                <Text style={{ fontSize: 24 }}> {params.title}</Text>
            </View>

            <Divider style={{ marginHorizontal: 10 }} />

            {tasks.length === 0 ?
                <EmptyTaskList />
                : (
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
                )}



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