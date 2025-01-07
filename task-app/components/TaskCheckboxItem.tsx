import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Checkbox, IconButton, MD3Colors, Text } from "react-native-paper";
import TaskRepository from "@/repository/Task";
import { useSQLiteContext } from "expo-sqlite";

type TaskCheckboxItemProps = {
    id: string;
    label: string;
    afterDeleteCallback: (message: string) => void;
}

export default function TaskCheckboxItem(props: TaskCheckboxItemProps) {

    const db = useSQLiteContext();
    const taskRepository = new TaskRepository(db);

    const [checked, setChecked] = useState<"checked" | "unchecked" | "indeterminate">("unchecked");

    const removeTask = () => {
        taskRepository.remove(props.id)
            .then(() => {
                props.afterDeleteCallback("Zadanie usunięte");
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox.Item
                key={props.id}
                label=""
                status={checked}
                onPress={() => setChecked(checked === "checked" ? "unchecked" : "checked")}
            />
            <Text
                style={{ textDecorationLine: checked === "checked" ? "line-through" : "none" }}>
                {props.label}
            </Text>
            <View style={{ flexDirection: "row", marginLeft: "auto" }}>
                <IconButton
                    icon="close-box"
                    iconColor={MD3Colors.error50}
                    size={20}
                    onPress={() => removeTask()}
                />
                <Link
                    href={{
                        pathname: '/edit-task',
                        params: { id: props.id, description: props.label }
                    }}
                    asChild
                >
                    <IconButton
                        icon="lead-pencil"
                        iconColor={MD3Colors.neutral30}
                        size={20}
                        onPress={() => console.log('Pressed')}
                    />
                </Link>
            </View>

        </View>
    )
}
