import { useAuth } from "@/auth/AuthContext";
import AddTaskModal from "@/components/AddTaskListModal";
import TaskListEntry from "@/components/TaskListEntry";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import TaskList from "@/dto/TaskList";
import TaskListRepository from "@/repository/TaskList";

export default function Index() {
	const db = useSQLiteContext();
	const taskListRepository = new TaskListRepository(db);

	const { username } = useAuth();

	const [taskLists, setTaskLists] = useState<TaskList[]>([]);

	const getTaskLists = () => {

		taskListRepository.findAll()
			.then((taskLists) => {
				setTaskLists(taskLists);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		getTaskLists();
	}, [])

	const refresh = () => {
		getTaskLists();
	}

	return (
		<View style={{ flex: 1 }}>

			<View style={{
				flexDirection: 'row',
				justifyContent: 'center',
				alignContent: 'center',
				marginTop: 15,
				marginBottom: 10
			}}
			>
				<Text style={{ fontSize: 24 }}> Twoje notatki</Text>

			</View>

			<Divider style={{ marginHorizontal: 10 }} />

			<SafeAreaView style={{ flex: 1 }}>
				<FlatList
					data={taskLists}
					renderItem={({ item }) => (
						<TaskListEntry id={item.id} title={item.title} refresh={refresh} />
					)}
					keyExtractor={item => item.id.toString()}
				/>
			</SafeAreaView>

			<AddTaskModal refresh={refresh} />

		</View >
	);
}
