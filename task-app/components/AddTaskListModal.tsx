import TaskListRepository from "@/repository/TaskList";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View } from "react-native";
import { Stack } from "react-native-flex-layout";
import { Button, Divider, Modal, Portal, Text, TextInput } from "react-native-paper";

type AddTaskModalProps = {
    refresh: () => void
}

export default function AddTaskModal(props: AddTaskModalProps) {

    const db = useSQLiteContext();
    const taskListRepository = new TaskListRepository(db);

    const [visible, setVisible] = useState(false);
    const [taskListTitle, setTaskListTitle] = useState('');

    const open = () => setVisible(true);
    const hide = () => setVisible(false);

    const addTaskList = (title: string) => {
        taskListRepository.insert(title)
            .then(() => { props.refresh() })
            .catch((error) => { console.log(error) })

        setTaskListTitle('');
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
                        <Text style={{ fontSize: 24 }}> Dodaj nową listę</Text>
                        <Divider />
                        <TextInput
                            label="Tytuł"
                            value={taskListTitle}
                            onChangeText={(text) => setTaskListTitle(text.trim())}
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
                            Dodaj
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
                    Nowa lista
                </Button>

            </View>
        </View>
    )
}