import { Link } from "expo-router"
import { List, MD3Colors, IconButton, Portal, Button, Dialog, Text } from "react-native-paper"
import { Stack } from "react-native-flex-layout"
import AddTaskModal from "./AddTaskModal"
import { useState } from "react";
import HttpClient from "@/api/HttpClient";
import { useAuth } from "@/auth/AuthContext";

type TaskListEntryProps = {
    id: number,
    title: string
    refresh: () => void
}

export default function TaskListEntry(props: TaskListEntryProps) {
    const { username } = useAuth();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const openDeleteDialog = () => setShowDeleteDialog(true);
    const hideDeleteDialog = () => setShowDeleteDialog(false);

    const deleteTaskList = () => {
        new HttpClient().deleteTaskList(props.id, username)
        .then((response) => {
            props.refresh();
            hideDeleteDialog();
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const renameTaskList = () => {}

    return (
        <Stack direction="row" style={{ flex: 1, padding: 10 }}>
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
                onPress={() => { }}
            />

            <Portal>
                <Dialog visible={showDeleteDialog} onDismiss={hideDeleteDialog}>
                    <Dialog.Title>Delete List?</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Are you sure you want to delete "{props.title}" list?
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={deleteTaskList} >Yes</Button>
                        <Button onPress={hideDeleteDialog} textColor="red">Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </Stack>
    )
}