import HttpClient from "@/api/HttpClient";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { router, useLocalSearchParams } from 'expo-router';

type AddTaskScreenProps = {
    listId: number
}

export default function AddTaskScreen() {

    const params: AddTaskScreenProps = useLocalSearchParams();

    const [taskDescription, setTaskDescription] = useState('');
    const [message, setMessage] = useState('');
    const httpClient = new HttpClient();

    const addNewTask = (taskDescription: string) => {
        
        if (taskDescription === '') {
            setMessage('Task description cannot be empty');
            return;
        }

        httpClient.addTask(params.listId, taskDescription)
            .then((response) => {
                console.log(response);
                router.back();
            })
            .catch((error) => {
                console.log(error);
            });
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