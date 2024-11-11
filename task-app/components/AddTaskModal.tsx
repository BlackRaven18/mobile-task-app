import { Button, Divider, Modal, Portal, TextInput, Text } from "react-native-paper";
import { Stack } from "react-native-flex-layout";
import HttpClient from "@/api/HttpClient";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { View } from "react-native";

type AddTaskModalProps = {
    refresh: () => void
}

export default function AddTaskModal(props: AddTaskModalProps) {
    const { username } = useAuth();

    const [visible, setVisible] = useState(false);
    const [taskListTitle, setTaskListTitle] = useState('');

    const open = () => setVisible(true);
    const hide = () => setVisible(false);
  

    const addTaskList = (title: string) => {
        new HttpClient().addTaskList(title, username)
            .then((response) => {
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <View>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hide}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20
                    }}
                >
                    <Stack spacing={10}>
                        <Text style={{ fontSize: 24 }}> Twoje notatki</Text>
                        <Divider />
                        <TextInput
                            label="Title"
                            value={taskListTitle}
                            onChangeText={(text) => setTaskListTitle(text)}
                        />

                        <Button
                            mode="contained"
                            icon={"note-plus"}
                            onPress={() => {
                                addTaskList(taskListTitle);
                                hide();
                                props.refresh()
                            }}
                        >
                            Add
                        </Button>
                    </Stack>
                </Modal>
            </Portal>


            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', padding: 10 }}>
                <Button
                    mode="contained"
                    icon={"note-plus"}
                    onPress={() => { open(); console.log('pressed') }}
                >
                    New List
                </Button>

            </View>
        </View>
    )
}