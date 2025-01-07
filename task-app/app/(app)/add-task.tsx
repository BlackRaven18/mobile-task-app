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
            setMessage('Opis zadania nie może być pusty');
            return;
        }

        taskRepository.insert(taskDescription, params.listId)
            .then(() => {
                setMessage('Zadanie zostało dodane');
                router.back();
            })
            .catch((error) => {
                console.log(error);
                setMessage('Nie udało się dodać zadania');
            })
    }

    return (
        <View style={{
            padding: 10,
            gap: 10,
            alignItems: 'center',
        }}
        >
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    label="Opis zadania"
                    value={taskDescription}
                    onChangeText={text => setTaskDescription(text)}
                    style={{ flex: 1 }}
                />
                <AddContactDetailsModal addContactDetails={addContactDetails} />
            </View>

            <Button
                mode="contained"
                onPress={() => addNewTask(taskDescription)}
                style={{ width: '100%' }}
            >
                Dodaj zadanie
            </Button>
            <Text>
                {message}
            </Text>
        </View>
    );
}

