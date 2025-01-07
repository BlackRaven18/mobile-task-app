import HttpClient from "@/api/HttpClient";
import { useAuth } from "@/contexts/AuthContext";
import TaskCheckboxItem from "@/components/TaskCheckboxItem";
import Task from "@/dto/Task";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { Divider, IconButton, MD3Colors, Portal, Snackbar, Text } from "react-native-paper";
import TaskRepository from "@/repository/Task";
import { useSQLiteContext } from "expo-sqlite";
import { useSync } from "@/contexts/SyncContext";

interface TaskListDetailsScreenParams {
    id: string
    title: string
}

function EmptyTaskList() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Lista jest pusta, dodaj pierwsze zadanie!</Text>
        </View>
    )
}

export default function TaskListDetailsScreen() {
    const db = useSQLiteContext();
    const { sync } = useSync();

    const params: TaskListDetailsScreenParams = useLocalSearchParams<{ id: string, title: string }>();

    const taskRepository = new TaskRepository(db);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const onToggleSnackBar = () => setVisible(!visible);

    const getTasks = () => {
        taskRepository.findByTaskListId(params.id.toString())
            .then((tasks) => {
                setTasks(tasks);
            })
            .catch((error) => {
                setTasks([]);
                console.log(error);
            })
    }

    useFocusEffect(
        useCallback(() => {
            sync()
                .then(() => {
                    getTasks();
                })
                .catch((error) => {
                    console.log(error);
                })
        }, [])
    );

    const refresh = () => {
        sync()
            .then(() => {
                getTasks();
            })
            .catch((error) => {
                console.log(error);
            })
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
                <Link href={{
                    pathname: '/add-task',
                    params: {
                        listTitle: params.title,
                        listId: params.id
                    }
                }} asChild>
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