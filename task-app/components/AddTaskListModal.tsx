import { Button, Divider, Modal, Portal, TextInput, Text } from "react-native-paper";
import { Stack } from "react-native-flex-layout";
import TaskListRepository from "@/repository/TaskList";
import { useAuth } from "@/auth/AuthContext";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

type AddTaskModalProps = {
    refresh: () => void
}

export default function AddTaskModal(props: AddTaskModalProps) {
    const { username } = useAuth();

    const db = useSQLiteContext();
    const taskListRepository = new TaskListRepository(db);

    const [visible, setVisible] = useState(false);
    const [taskListTitle, setTaskListTitle] = useState('');

    const open = () => setVisible(true);
    const hide = () => setVisible(false);

    const addTaskList = (title: string) => {
        taskListRepository.insert(title.trim())
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
                        <Text style={{ fontSize: 24 }}> Add New Task List</Text>
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