import { createContext, useState, useContext, PropsWithChildren, useEffect } from "react";
import { performSync } from "@/services/SyncService";
import { openDatabaseSync } from "expo-sqlite";
import * as AsyncStorageService from "@/services/AsyncStorageService";
import { getCurrentDateTime } from "@/utils/date";
import { useAuth } from "./AuthContext";

const SyncContext = createContext({
    isSyncing: false,
    sync: async () => { },
});

export const SyncProvider = ({ children }: PropsWithChildren) => {
    const [isSyncing, setIsSyncing] = useState(false);

    const db = openDatabaseSync('test.db');
    const { username } = useAuth();

    useEffect(() => {
        AsyncStorageService.storeData('lastSync', '1970-01-01 12:00:00')
            .then(() => console.log('lastSync set to 1970-01-01 12:00:00'))
            .catch(error => console.log(error));
    }, []);

    const sync = async () => {
        setIsSyncing(true);

        const lastSync = await AsyncStorageService.getData('lastSync') ?? '1970-01-01 12:00:00';
        await performSync(db, lastSync, username)

        const currentDateTime = getCurrentDateTime();
        await AsyncStorageService.storeData('lastSync', currentDateTime);

        setIsSyncing(false);
        console.log("Sync complete, updated lastSync to: ", currentDateTime);

    };

    return (
        <SyncContext.Provider value={{ isSyncing, sync }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => useContext(SyncContext);