import TaskRepository from "@/repository/Task";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";

type AddTaskScreenProps = {
    listTitle: string,
    listId: string
}

export default function AddTaskScreen() {

    const params: AddTaskScreenProps = useLocalSearchParams();

    const db = useSQLiteContext();
    const taskRepository = new TaskRepository(db);

    const [taskDescription, setTaskDescription] = useState('');
    const [message, setMessage] = useState('');

    const addNewTask = (taskDescription: string) => {

        if (taskDescription === '') {
            setMessage('Task description cannot be empty');
            return;
        }

        taskRepository.insert(taskDescription, params.listId)
            .then(() => {
                setMessage('Task added successfully');
                router.back();
            })
            .catch((error) => {
                console.log(error);
                setMessage('Error adding task');
            })
    }

    return (
        <View style={{ padding: 10 }}>
            <TextInput
                label="Task description"
                value={taskDescription}
                onChangeText={text => setTaskDescription(text)}
            />

            <Button mode="contained" onPress={() => addNewTask(taskDescription)}>
                Add task
            </Button>
            <Text>
                {message}
            </Text>
        </View>
    );
}