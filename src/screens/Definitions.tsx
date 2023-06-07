import React, { useEffect, useState } from 'react';
import { ButtonIcon, ButtonText, ColorScheme, Header, Input, InputTypes, Layout, Modal, Settings, SizeScheme, Takoz } from '@19sth/react-native-pieces';
import { faAdd, faCartPlus, faFileArchive, faFileArrowDown, faRotateBack, faShoePrints, faStairs, faStepBackward } from '@fortawesome/free-solid-svg-icons';
import ContentView from '../components/ContentView';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { KEY_DEFINITIONS, KEY_TASKS } from '../util';
import { Pressable, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ITask } from '../contracts';

export default function Definitions({ navigation }) {
    const { getItem } = useAsyncStorage(KEY_DEFINITIONS);
    const asyncStoreTasks = useAsyncStorage(KEY_TASKS);
    const [definitions, setDefinitions] = useState([] as { title: string, steps: any[] }[]);
    const [modalVisible, setModalVisible] = useState(false);
    const [taskNote, setTaskNote] = useState('');
    const [defIndex, setDefIndex] = useState(-1);
    const isFocused = useIsFocused();

    const load = async () => {
        let defStr = await getItem();
        if (!defStr) {
            defStr = '[]';
        }
        const defs = JSON.parse(defStr);
        setDefinitions(defs);
    }

    useEffect(() => {
        load();
    }, [isFocused])

    return (
        <Layout>
            <Header
                navigation={navigation}
                title='Check'
                buttons={[
                    {
                        faIcon: faAdd, handleClick: () => {
                            navigation.push('DefinitionEdit')
                        }
                    }
                ]}
            />

            <ContentView>

                <View>
                    {
                        definitions.map((e, i) => (
                            <Pressable key={`def_${i}`} onPress={() => {
                                navigation.push('DefinitionEdit', { index: i });
                            }}>
                                <View style={{
                                    marginBottom: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: ColorScheme.get().secondary,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 5,
                                    paddingBottom: 5
                                }}>
                                    <ButtonIcon
                                        faIcon={faCartPlus}
                                        handleClick={() => {
                                            setDefIndex(i);
                                            setTaskNote('');
                                            setModalVisible(true);
                                        }}/>
                                    <View style={{
                                        flex: 1,
                                        paddingHorizontal: 10
                                    }}>
                                        <Text style={{
                                            fontSize: SizeScheme.get().font.c
                                        }}>
                                            {e.title}
                                        </Text>
                                    </View>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{
                                        fontSize: SizeScheme.get().font.d
                                    }}>
                                        {e.steps.length}
                                    </Text>
                                    <Takoz width={5}/>
                                    <FontAwesomeIcon icon={faShoePrints}/>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    }
                </View>

                <Modal
                    visible={modalVisible}
                    handleClose={()=>{
                        setModalVisible(false);
                    }}
                    style={{height: 350}}>

                    <View>
                        <Input
                            label='Add Note for Task'
                            type={InputTypes.TEXT}
                            settings={[Settings.TEXT_MULTILINE_6]}
                            value={[taskNote]}
                            handleChange={val=>{setTaskNote(val[0])}}/>
                        <Takoz height={20}/>
                        <ButtonText
                            label='Add Task'
                            handleClick={async () => {
                                let taskStr = await asyncStoreTasks.getItem();
                                if (!taskStr) {
                                    taskStr = '[]';
                                }
                                const tasks: ITask[] = JSON.parse(taskStr);
                                tasks.push({
                                    note: taskNote,
                                    definitionIndex: defIndex,
                                    title: definitions[defIndex].title,
                                    steps: definitions[defIndex].steps,
                                    checked: definitions[defIndex].steps.map(_=>false)
                                });
                                await asyncStoreTasks.setItem(JSON.stringify(tasks));
                                navigation.goBack();
                            }}/>
                    </View>

                </Modal>

            </ContentView>
        </Layout>
    );
}