import React, { useEffect, useState } from 'react';
import { ColorScheme, Header, Layout, SizeScheme } from '@19sth/react-native-pieces';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import ContentView from '../components/ContentView';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { KEY_DEFINITIONS } from '../util';
import { Pressable, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function Definitions({ navigation }) {
    const { getItem } = useAsyncStorage(KEY_DEFINITIONS);
    const [definitions, setDefinitions] = useState([] as {title: string, steps: any[]}[]);
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
                            <Pressable key={`def_${i}`} onPress={()=>{
                                navigation.push('DefinitionEdit', {index: i});
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
                                    <Text style={{
                                        fontSize: SizeScheme.get().font.c
                                    }}>
                                        {e.title}
                                    </Text>
                                    <Text style={{
                                        fontSize: SizeScheme.get().font.c
                                    }}>
                                        {e.steps.length}
                                    </Text>
                                </View>
                            </Pressable>
                        ))
                    }
                </View>

            </ContentView>
        </Layout>
    );
}