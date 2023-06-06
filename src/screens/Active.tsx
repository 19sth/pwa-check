import { Header, Layout } from '@19sth/react-native-pieces';
import React from 'react';
import ContentView from '../components/ContentView';
import { faAdd, faCircleQuestion, faFloppyDisk, faList } from '@fortawesome/free-solid-svg-icons';

export default function Active({ navigation }) {
    return (
        <Layout>
            <Header
                navigation={navigation}
                title='Check'
                buttons={[
                    {faIcon: faCircleQuestion, handleClick: ()=>{console.log("go to info page")}},
                    {faIcon: faFloppyDisk, handleClick: ()=>{console.log("go to info page")}},
                    {faIcon: faList, handleClick: ()=>{
                        navigation.push("Definitions");
                    }},
                    {faIcon: faAdd, handleClick: ()=>{console.log("go to info page")}}
                ]}
            />

            <ContentView>

            </ContentView>
        </Layout>
    );
}