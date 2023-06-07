import { ColorScheme, Header, Layout, SizeScheme } from '@19sth/react-native-pieces';
import React, { useEffect, useState } from 'react';
import ContentView from '../components/ContentView';
import { ITask } from '../contracts';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { KEY_TASKS } from '../util';
import { Pressable, Text, View } from 'react-native';

export default function Task({ navigation, route }) {
    const [task, setTask] = useState({} as ITask);
    const asyncStoreTasks = useAsyncStorage(KEY_TASKS);

    const load = async () => {
        if (route.params && route.params.taskIndex !== undefined) {
            let taskStr = await asyncStoreTasks.getItem();
            if (!taskStr) {
                taskStr = '[]';
            }
            const taskList: ITask[] = JSON.parse(taskStr);
            console.log(taskList[route.params.taskIndex]);
            setTask(taskList[route.params.taskIndex]);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <Layout>
            <Header
                navigation={navigation}
                title='Check'
                buttons={[]}
            />

            <ContentView>
                <Text style={{
                    fontSize: SizeScheme.get().font.c,
                    fontWeight: 'bold'
                }}>
                    {task.title}
                </Text>

                <View style={{
                    padding: 10,
                    backgroundColor: ColorScheme.get().backgroundDark,
                    marginVertical: 20
                }}>
                    <Text>
                        {task.note}
                    </Text>
                </View>
                {
                    (task.steps !== undefined) && task.steps.map((e, i) => (
                        <Pressable key={`step_${i}`} onPress={async ()=>{
                            const tempTask = {...task};
                            tempTask.checked[i] = !tempTask.checked[i];

                            const taskStr = await asyncStoreTasks.getItem();
                            const taskList: ITask[] = JSON.parse(taskStr);
                            taskList[route.params.taskIndex] = tempTask;

                            await asyncStoreTasks.setItem(JSON.stringify(taskList));

                            load();
                        }}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginTop: 20,
                                paddingBottom: 10,
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: ColorScheme.get().secondary
                            }}>
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderColor: ColorScheme.get().shadowColor,
                                    backgroundColor: (task.checked[i]) ? ColorScheme.get().primary : 'transparent'
                                }}>
                                </View>
                                <View style={{
                                    flex: 1,
                                    paddingStart: 20
                                }}>
                                    <Text style={{
                                        fontSize: SizeScheme.get().font.d
                                    }}>
                                        {e}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    ))
                }
            </ContentView>
        </Layout>
    )
}