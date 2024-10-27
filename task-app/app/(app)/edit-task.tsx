import HttpClient from "@/api/HttpClient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

type EditTaskScreenParams = {
    id: string,
    description: string
}

export default function EditTaskScreen() {
    const params: EditTaskScreenParams = useLocalSearchParams();
    const [description, setDescription] = useState(params.description);

    const httpClient = new HttpClient();

    const saveChanges = (description: string) => {
        httpClient.updateTask(parseInt(params.id), description)
        .then((response) => {
            console.log(response);
            router.back();
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