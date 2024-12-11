import { SQLiteProvider, useSQLiteContext, openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { AuthProvider } from "@/auth/AuthContext";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const db = openDatabaseSync('test_database');

    useDrizzleStudio(db);


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
                id INTEGER PRIMARY KEY NOT NULL, 
                title TEXT
            );

            CREATE TABLE task (
                id INTEGER PRIMARY KEY NOT NULL,
                description TEXT,
                task_list_id INTEGER,
                FOREIGN KEY (task_list_id) REFERENCES task_list (id) ON DELETE CASCADE
            );
        `);
        await db.runAsync('INSERT INTO task_list (id, title) VALUES (?, ?)', 1, 'First task list');
        await db.runAsync('INSERT INTO task (id, description, task_list_id) VALUES (?, ?, ?)', 1, 'First task', 1);
        currentDbVersion = 1;
    }
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
