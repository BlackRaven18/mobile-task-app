import TaskListRepository from "@/repository/TaskList";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
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
    const [error, setError] = useState('');

    const open = () => setVisible(true);
    const hide = () => setVisible(false);

    useEffect(() => {
        setTaskListTitle('');
        setError('');
    }, [])

    const addTaskList = (title: string) => {

        if (title.trim().length <= 0) {
            setError('Tytuł listy jest wymagany');
            return;
        }

        taskListRepository.insert(title)
            .then(() => { props.refresh() })
            .catch((error) => { console.log(error) })

        setTaskListTitle('');
        
        hide();
        props.refresh()
    }

    return (
        <View>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hide}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20,
                        gap: 10
                    }}
                    style={{
                        margin: 10,
                        // alignItems: 'center'
                    }}

                >
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
                        }}
                    >
                        Dodaj
                    </Button>
                    <Text>{error}</Text>
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