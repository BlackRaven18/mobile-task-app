import { AuthProvider } from "@/auth/AuthContext";
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {

    return (
        <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
            <AuthProvider>
                <PaperProvider>
                    <Stack screenOptions={{ headerShown: false, }}>
                        <Stack.Screen name="sign-in" options={{ headerShown: true, headerTitle: 'Sign In' }} />
                        <Stack.Screen name="sign-up" options={{ headerShown: true, headerTitle: 'Sign Up' }} />
                    </Stack>
                </PaperProvider>
            </AuthProvider>
        </SQLiteProvider>
    );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;

    console.log("Migrating database...");

    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    let currentDbVersion = result?.user_version ?? 0;

    console.log(`Current database version: ${currentDbVersion}`);

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }
    if (currentDbVersion === 0) {
        await db.execAsync(`
            PRAGMA journal_mode = 'wal';

            CREATE TABLE task_list (
                id TEXT PRIMARY KEY, 
                title TEXT UNIQUE,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted INTEGER DEFAULT 0
            );

            CREATE TABLE task (
                id TEXT PRIMARY KEY,
                description TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                task_list_id INTEGER,
                deleted INTEGER DEFAULT 0,
                
                FOREIGN KEY (task_list_id) REFERENCES task_list (id) ON DELETE CASCADE
            );
        `);

        currentDbVersion = 1;
    }
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
