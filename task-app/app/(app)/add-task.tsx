import AddContactDetailsModal from "@/components/AddContactDetailsModal";
import TaskRepository from "@/repository/Task";
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

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

    const addContactDetails = (contactDetails: string) => {
        setTaskDescription(taskDescription + contactDetails);
    }

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
        <View style={{ padding: 10, gap: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    label="Opis zadania"
                    value={taskDescription}
                    onChangeText={text => setTaskDescription(text)}
                    style={{ flex: 1 }}
                />
                <AddContactDetailsModal addContactDetails={addContactDetails} />
            </View>

            <Button mode="contained" onPress={() => addNewTask(taskDescription)}>
                Dodaj zadanie
            </Button>
            <Text>
                {message}
            </Text>
        </View>
    );
}

