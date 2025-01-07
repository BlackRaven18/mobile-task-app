import React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { View } from "react-native";
import { Menu, Appbar, Divider } from "react-native-paper";

export default function AppHeaderMenu() {
    const [visible, setVisible] = useState(false);
    const { signOut } = useAuth();

    const closeMenu = () => setVisible(false);
    const openMenu = () => setVisible(true);

    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon="menu" onPress={() => { openMenu() }} />}
                    style={{ marginTop: 70 }}
                >
                    <Menu.Item 
                        leadingIcon="note-edit" 
                        title="Twoje notatki" 
                        onPress={() => { router.navigate("/(app)") }}
                        />
                    <Divider />
                    <Menu.Item
                        titleStyle={{ color: 'red' }}
                        leadingIcon="logout"
                        title="Wyloguj się"
                        onPress={signOut}
                    />
                </Menu>
            </View>
        </>
    );
}