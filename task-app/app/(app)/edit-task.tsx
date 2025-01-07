import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import TaskRepository from "@/repository/Task";
import { useSQLiteContext } from "expo-sqlite";
import AddContactDetailsModal from "@/components/AddContactDetailsModal";

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

    const addContactDetails = (contactDetails: string) => {
        setDescription(description + contactDetails);
    }

    return (
        <View
            style={{ 
                padding: 10, 
                gap: 10,
            }}
        >
            <View style={{flexDirection: 'row'}}>
                <TextInput
                    label="Opis zadania"
                    value={description}
                    onChangeText={text => setDescription(text)}
                    style={{ flex: 1 }}
                />
                <AddContactDetailsModal addContactDetails={addContactDetails}/>
            </View>

            <Button
                mode="contained"
                onPress={() => saveChanges(description)}
            >
                Zapisz zmiany
            </Button>
        </View>
    );
}