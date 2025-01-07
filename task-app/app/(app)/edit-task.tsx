import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import TaskRepository from "@/repository/Task";
import { useSQLiteContext } from "expo-sqlite";

type EditTaskScreenParams = {
    id: string,
    description: string
}

export default function EditTaskScreen() {
    const params: EditTaskScreenParams = useLocalSearchParams();
    const [description, setDescription] = useState(params.description);

    const db = useSQLiteContext();
    const taskRepository = new TaskRepository(db);

    const saveChanges = (description: string) => {
        taskRepository.update(params.id, description)
            .then(() => {
                router.back();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <View
            style={{ padding: 10 }}
        >
            <TextInput
                label="Task Description"
                value={description}
                onChangeText={text => setDescription(text)}
            />

            <Button
                mode="contained"
                onPress={() => saveChanges(description)}
            >
                Save
            </Button>
        </View>
    );
}