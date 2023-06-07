import React, { useEffect, useState } from 'react';
import { ButtonIcon, Header, Input, InputTypes, Layout, SizeScheme, Takoz } from '@19sth/react-native-pieces';
import ContentView, { ViewType } from '../components/ContentView';
import { Text, View } from 'react-native';
import { IconDefinition, faAdd, faAngleDown, faAngleUp, faCheck, faFloppyDisk, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { KEY_DEFINITIONS, KEY_TASKS } from '../util';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import DynamicListItem from '../components/DynamicListItem';

export default function DefinitionEdit({ navigation, route }) {
    const [title, setTitle] = useState("");
    const [steps, setSteps] = useState([{ content: "", showOptions: false }]);
    const { getItem, setItem } = useAsyncStorage(KEY_DEFINITIONS);

    const load = async () => {
        const defStr = await getItem();
        const defs = JSON.parse(defStr);
        setSteps(defs[route.params.index].steps.map(e=>({content: e, showOptions: false})));
        setTitle(defs[route.params.index].title);
    }

    useEffect(() => {
        if (route.params && route.params.index !== undefined) {
            load();
        }
    }, [route.params]);

    const deleteButton = [] as {
        faIcon: IconDefinition;
        handleClick: () => void;
    }[];

    if (route.params && route.params.index !== undefined) {
        deleteButton.push({
            faIcon: faTrashCan,
            handleClick: async () => {
                const defStr = await getItem();
                const defs = JSON.parse(defStr);
                defs.splice(route.params.index, 1);
                setItem(JSON.stringify(defs));
                setSteps(defs.steps);
                navigation.goBack();
            }
        });
    }

    return (
        <Layout>
            <Header
                navigation={navigation}
                title='Check'
                buttons={[
                    ...deleteButton,
                    {
                        faIcon: faFloppyDisk, handleClick: async () => {
                            let defString = await getItem();
                            if (!defString) {
                                defString = '[]';
                            }

                            const definitions = JSON.parse(defString);

                            if (route.params && route.params.index !== undefined) {
                                definitions[route.params.index] = {
                                    title,
                                    "steps" : steps.map(e=>e.content)
                                }
                            } else {
                                definitions.push({
                                    title,
                                    "steps" : steps.map(e=>e.content)
                                });
                            }

                            setItem(JSON.stringify(definitions));

                            navigation.goBack();
                        }
                    }
                ]}
            />
            <ContentView viewType={ViewType.SCROLLVIEW}>

                <Input
                    label='Title'
                    handleChange={e => setTitle(e[0])}
                    value={[title]}
                    type={InputTypes.TEXT} />

                <Takoz />

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{
                        fontSize: SizeScheme.get().font.c,
                        fontWeight: 'bold'
                    }}>Steps</Text>
                    <ButtonIcon faIcon={faAdd} handleClick={() => {
                        setSteps([...steps, { content: "", showOptions: false }]);
                    }} />
                </View>

                {
                    steps.map((e, i) => (
                        <DynamicListItem
                            key={`DynamicListItem_${i}`}
                            index={i}
                            buttons={[
                                {
                                    faIcon: faAngleUp, handleClick: ix => {
                                        if (ix > 0) {
                                            const tSteps = [...steps];
                                            const temp = tSteps[ix];
                                            tSteps[ix] = tSteps[ix - 1];
                                            tSteps[ix - 1] = temp;
                                            setSteps(tSteps);
                                        }
                                    }
                                },
                                {
                                    faIcon: faAngleDown, handleClick: ix => {
                                        if (ix < steps.length - 1) {
                                            const tSteps = [...steps];
                                            const temp = tSteps[ix];
                                            tSteps[ix] = tSteps[ix + 1];
                                            tSteps[ix + 1] = temp;
                                            setSteps(tSteps);
                                        }
                                    }
                                },
                                {
                                    faIcon: faTrashCan, handleClick: ix => {
                                        const tSteps = [...steps];
                                        tSteps.splice(ix, 1);
                                        setSteps(tSteps);
                                    }
                                },
                                {
                                    faIcon: faCheck, handleClick: ix => {
                                        const tSteps = [...steps];
                                        tSteps[ix].showOptions = !tSteps[ix].showOptions;
                                        setSteps(tSteps);
                                    }
                                },
                            ]}
                            showOptions={steps[i].showOptions}
                            openShowOptions={ix => {
                                if (steps.every(ex => ex.showOptions === false)) {
                                    const tSteps = [...steps];
                                    tSteps[ix].showOptions = !tSteps[ix].showOptions;
                                    setSteps(tSteps);
                                }
                            }}
                            height={70}>

                            <View style={{
                                paddingStart: 10,
                                paddingTop: 15
                            }}>
                                <Input
                                    label=''
                                    type={InputTypes.TEXT}
                                    value={[e.content]}
                                    handleChange={val => {
                                        let tSteps = [...steps];
                                        tSteps[i].content = val[0];
                                        setSteps(tSteps);
                                    }} />
                            </View>

                        </DynamicListItem>
                    ))
                }
            </ContentView>
        </Layout>
    );
}