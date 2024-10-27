import HttpClient from "@/api/HttpClient";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { router } from 'expo-router';

export default function AddTaskScreen() {

    const [taskDescription, setTaskDescription] = useState('');
    const [message, setMessage] = useState('');
    const httpClient = new HttpClient();

    const addNewTask = (taskDescription: string) => {
        
        if (taskDescription === '') {
            setMessage('Task description cannot be empty');
            return;
        }

        httpClient.addTask(taskDescription)
            .then((response) => {
                console.log(response);
                router.back();
            })
            .catch((error) => {
                console.error(error);
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