
import * as Contacts from 'expo-contacts';
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Button, IconButton, Modal, Portal, Searchbar, Text } from "react-native-paper";

type AddContactDetailsModalProps = {
    addContactDetails: (contactDetails: string) => void
}

export default function AddContactDetailsModal(props: AddContactDetailsModalProps) {

    const [visible, setVisible] = useState(false);
    const [contacts, setContacts] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredContacts, setFilteredContacts] = useState<string[]>([]);

    const openModal = async () => {
        const { status } = await Contacts.requestPermissionsAsync();

        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Emails],
            });

            if (data.length > 0) {
                const contacts = data.map((contact) => contact.firstName + ' ' + (contact.lastName ?? ''));
                setContacts(contacts)
                setFilteredContacts(contacts);
                console.log(contacts);
            }

            setVisible(true)
        }
    }
    const hideModal = () => setVisible(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        const filtered = contacts.filter((contact) =>
            contact.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredContacts(filtered);
    };

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
                    <View>
                        
                    </View>
                    <Text style={{ fontSize: 24, marginBottom: 15 }}> Kontakty</Text>

                    <Searchbar
                        placeholder="Wyszukaj kontakt..."
                        onChangeText={handleSearch}
                        value={searchQuery}
                        style={{ marginBottom: 10 }}
                    />

                    <FlatList
                        data={filteredContacts}
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