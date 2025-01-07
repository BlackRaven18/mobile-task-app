
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Text, Modal, Portal, Divider, Button, IconButton } from "react-native-paper";
import * as Contacts from 'expo-contacts';

type AddContactDetailsModalProps = {
    addContactDetails: (contactDetails: string) => void
}

export default function AddContactDetailsModal(props: AddContactDetailsModalProps) {

    const [visible, setVisible] = useState(false);
    const [contacts, setContacts] = useState<string[]>([]);

    const openModal = async () => {
        const { status } = await Contacts.requestPermissionsAsync();

        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Emails],
            });

            if (data.length > 0) {
                const contacts = data.map((contact) => contact.firstName + ' ' + (contact.lastName ?? ''));
                setContacts(contacts)
                console.log(contacts);
            }

            setVisible(true)
        }
    }
    const hideModal = () => setVisible(false);

    return (
        <View>
            <IconButton
                icon="contacts"
                iconColor={'green'}
                size={30}
                onPress={async () => await openModal()}
            />

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={{
                        height: '80%',
                        width: '80%',
                        backgroundColor: 'white',
                        padding: 20,
                        alignItems: 'center',
                    }}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, marginBottom: 15 }}> Kontakty</Text>
                    <Divider />

                    <FlatList
                        data={contacts}
                        renderItem={({ item }) => (

                            <View >
                                <Button
                                    mode="contained"
                                    onPress={() => { 
                                        props.addContactDetails(item)
                                        hideModal()
                                    }}
                                >
                                    {item}
                                </Button>
                            </View>

                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        style={{ width: '100%', padding: 10 }}
                    />
                </Modal>
            </Portal>
        </View>
    )
}