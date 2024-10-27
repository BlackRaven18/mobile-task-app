import HttpClient from "@/api/HttpClient";
import { Link } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Checkbox, IconButton, Text, MD3Colors, Snackbar, Portal, Tooltip } from "react-native-paper";

type TaskCheckboxItemProps = {
    id: number;
    label: string;
    afterDeleteCallback: (message: string) => void;
}

export default function TaskCheckboxItem(props: TaskCheckboxItemProps) {

    const httpClient = new HttpClient();
    const [checked, setChecked] = useState<"checked" | "unchecked" | "indeterminate">("unchecked");

    const removeTask = () => {
        httpClient.deleteTask(props.id).then((response) => {
            console.log(response);
            props.afterDeleteCallback(response.toString());
        }).catch((error) => {
            console.error(error);
        });

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
