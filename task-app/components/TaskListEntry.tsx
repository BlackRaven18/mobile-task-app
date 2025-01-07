import { Link } from "expo-router";
import { useState } from "react";
import { Stack } from "react-native-flex-layout";
import { Button, Dialog, Divider, IconButton, List, MD3Colors, Modal, Portal, Text, TextInput } from "react-native-paper";
import TaskListRepository from "@/repository/TaskList";
import { useSQLiteContext } from "expo-sqlite";

type TaskListEntryProps = {
    id: string,
    title: string
    refresh: () => void
}

export default function TaskListEntry(props: TaskListEntryProps) {

    const db = useSQLiteContext();
    const taskListRepository = new TaskListRepository(db);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [newListName, setNewListName] = useState(props.title);

    const openDeleteDialog = () => setShowDeleteDialog(true);
    const hideDeleteDialog = () => setShowDeleteDialog(false);

    const openRenameModal = () => setShowRenameModal(true);
    const hideRenameModal = () => setShowRenameModal(false);

    const deleteTaskList = () => {
        taskListRepository.remove(props.title)
            .then(() => {
                props.refresh();
                hideDeleteDialog();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const renameTaskList = (newListName: string) => {
        taskListRepository.update(props.id, newListName)
            .then(() => {
                props.refresh();
                hideRenameModal();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <Stack direction="row" style={styles.containter}>
            <List.Icon color={MD3Colors.tertiary50} icon="note-edit" />
            <Link
                href={{
                    pathname: '/task-list-details',
                    params: {
                        id: props.id,
                        title: props.title
                    }
                }}
                asChild
            >
                <List.Item
                    title={props.title}
                    onPress={() => { console.log("Pressed") }}
                    style={{ flex: 1 }}
                />
            </Link>
            <IconButton
                icon="delete"
                iconColor={MD3Colors.error50}
                onPress={openDeleteDialog}
            />
            <IconButton
                icon="pencil"
                onPress={openRenameModal}
            />

            <Portal>
                <Dialog visible={showDeleteDialog} onDismiss={hideDeleteDialog}>
                    <Dialog.Title>Usunąć listę?</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Czy jesteś pewny, że chcesz usunąć listę "{props.title}"?
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={deleteTaskList} >Tak</Button>
                        <Button onPress={hideDeleteDialog} textColor="red">Anuluj</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Portal>
                <Modal
                    visible={showRenameModal}
                    onDismiss={hideRenameModal}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20
                    }}
                >
                    <Stack spacing={10}>
                        <Text style={{ fontSize: 24 }}> Zmień tytuł listy</Text>
                        <Divider />
                        <TextInput
                            label="Nowy tytuł"
                            value={newListName}
                            onChangeText={(text) => setNewListName(text)}
                        />

                        <Button
                            mode="contained"
                            icon={"pencil"}
                            onPress={() => {
                                renameTaskList(newListName);
                            }}
                        >
                            Zmień tytuł
                        </Button>
                    </Stack>
                </Modal>
            </Portal>
        </Stack>
    )
}

const styles = {
    containter: {
        flex: 1,
        padding: 5,
        margin: 5,
        borderColor: MD3Colors.primary50,
        backgroundColor: MD3Colors.primary80,
        borderWidth: 2,
        borderRadius: 10
    }
}