import { ButtonText, Header, Input, InputTypes, Layout, Modal, Settings, SizeScheme, Takoz } from '@19sth/react-native-pieces';
import React, { useEffect, useState } from 'react';
import ContentView from '../components/ContentView';
import { faCheck, faCircleQuestion, faEdit, faList, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { KEY_TASKS } from '../util';
import { Pressable, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import DynamicListItem from '../components/DynamicListItem';
import { ITask } from '../contracts';

export default function Dashboard({ navigation }) {
    const [tasks, setTasks] = useState([] as ITask[]);
    const [showOptions, setShowOptions] = useState([] as boolean[]);
    const [taskNote, setTaskNote] = useState("");
    const [showTaskNoteModal, setShowTaskNoteModal] = useState(false);
    const [taskIndex, setTaskIndex] = useState(-1);
    const asyncStoreTasks = useAsyncStorage(KEY_TASKS);
    const isFocused = useIsFocused();

    const load = async () => {
        let taskStr = await asyncStoreTasks.getItem();
        if (!taskStr) {
            taskStr = '[]';
        }
        const taskList = JSON.parse(taskStr);
        setTasks(taskList);
    }

    useEffect(() => {
        load();
    }, [isFocused]);

    return (
        <Layout>
            <Header
                navigation={navigation}
                title='Check'
                buttons={[
                    { faIcon: faCircleQuestion, handleClick: () => { 
                        window.open("https://mujdecisy.github.io/app/check-multi-defined-tasks", "blank");
                     } },
                    {
                        faIcon: faList, handleClick: () => {
                            navigation.push("Definitions");
                        }
                    }
                ]}
            />
            <ContentView>
                {
                    tasks.length < 1 && (
                        <View>
                            <Takoz height={20}/>
                            <Text style={{
                                fontSize: SizeScheme.get().font.c,
                                textAlign: 'center'
                            }}>
                                There is no task to do daily.
                            </Text>
                            <Takoz height={20}/>
                            <ButtonText
                                label='Add a Task'
                                handleClick={()=>{
                                    navigation.push('Definitions');
                                }}/>
                        </View>
                    )
                }
                {
                    tasks.length > 0 &&
                    tasks.map((e, i) => (
                        <View key={`task_${i}`}>
                            <DynamicListItem
                                buttons={[
                                    {
                                        faIcon: faTrashCan, handleClick: async (ix) => {
                                            const tShowOptions = [...showOptions];
                                            tShowOptions[ix] = false;

                                            const taskStr = await asyncStoreTasks.getItem();
                                            const taskList = JSON.parse(taskStr);
                                            taskList.splice(i, 1);
                                            await asyncStoreTasks.setItem(JSON.stringify(taskList));

                                            setShowOptions(tShowOptions);

                                            load();
                                        }
                                    },
                                    {
                                        faIcon: faEdit, handleClick: (ix) => {
                                            setTaskIndex(ix);
                                            setTaskNote(tasks[ix].note);
                                            setShowTaskNoteModal(true);
                                        }
                                    },
                                    {
                                        faIcon: faCheck, handleClick: (ix) => {
                                            const tShowOptions = [...showOptions];
                                            tShowOptions[ix] = false;
                                            setShowOptions(tShowOptions);
                                        }
                                    }
                                ]}
                                height={50}
                                index={i}
                                showOptions={showOptions[i]}
                                openShowOptions={(ix) => {
                                    const tShowOptions = [...showOptions];
                                    tShowOptions[ix] = true;
                                    setShowOptions(tShowOptions);
                                }}>
                                <Pressable onPress={() => {
                                    navigation.push('Task', { taskIndex: i });
                                }}>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <View style={{
                                            paddingStart: 10,
                                            flex: 1
                                        }}>
                                            <Text style={{
                                                fontSize: SizeScheme.get().font.e,
                                                fontWeight: 'bold'
                                            }}>
                                                {e.title}
                                            </Text>
                                            <View style={{
                                                maxHeight: 33,
                                                overflow: 'hidden'
                                            }}>
                                                <Text>{e.note}</Text>
                                            </View>
                                        </View>
                                        <Text style={{fontSize: SizeScheme.get().font.e }}>
                                            {e.checked.filter(ex=>ex).length}/{e.checked.length}
                                        </Text>
                                    </View>
                                </Pressable>
                            </DynamicListItem>
                        </View>
                    ))
                }

            </ContentView>


            <Modal
                visible={showTaskNoteModal}
                handleClose={() => {
                    setShowTaskNoteModal(false);
                }}
                style={{ height: 350 }}>

                <View>
                    <Input
                        label='Add Note for Task'
                        type={InputTypes.TEXT}
                        settings={[Settings.TEXT_MULTILINE_6]}
                        value={[taskNote]}
                        handleChange={val => { setTaskNote(val[0]) }} />
                    <Takoz height={20} />
                    <ButtonText
                        label='Save Task'
                        handleClick={async () => {
                            let taskStr = await asyncStoreTasks.getItem();
                            if (!taskStr) {
                                taskStr = '[]';
                            }
                            const tasks: ITask[] = JSON.parse(taskStr);
                            tasks[taskIndex].note = taskNote;
                            await asyncStoreTasks.setItem(JSON.stringify(tasks));
                            setShowTaskNoteModal(false);

                            const tempShowOptions = [...showOptions];
                            tempShowOptions[taskIndex] = false;
                            setShowOptions(tempShowOptions);

                            load();
                        }} />
                </View>

            </Modal>
        </Layout>
    );
}