// import {Button, IconButton, Stack, TextInput } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";

export default function LoginScreen() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState(''); 

    return (
        <></>
        // <Stack spacing={2} style={{ margin: 16 }}>
        //     <TextInput
        //         label="Login"
        //         variant="outlined"
        //         value={login}
        //         onChange={e => setLogin(e.nativeEvent.text)}
        //         leading={props => <Icon name="account" {...props} />}
        //     />
        //     <TextInput
        //         label="Password"
        //         variant="outlined"
        //         value={password}
        //         onChange={e => setPassword(e.nativeEvent.text)}
        //         trailing={props => (
        //             <IconButton icon={props => <Icon name="eye" {...props} />} {...props} />
        //         )}
        //     />

        //     <Button title="Login" onPress={() => console.log(login, password)} />
        // </Stack>
    );
}
