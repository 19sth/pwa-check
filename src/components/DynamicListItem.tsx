import { ButtonIcon, ColorScheme, SizeScheme } from '@19sth/react-native-pieces';
import { IconDefinition, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Text, View } from 'react-native';

interface DynamicListItemProps {
    children: React.ReactNode
    index: number
    height: number
    showOptions: boolean
    openShowOptions: (ix: number) => void
    buttons: {
        faIcon: IconDefinition
        handleClick: (ix: number) => void
    }[]
}

export default function DynamicListItem(props: DynamicListItemProps) {

    if (props.showOptions) {
        return (
            <View key={`dynamicItem_${props.index}`} style={{
                height: props.height,
                marginTop: 10,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {
                    props.buttons.map((e,i) => (
                        <ButtonIcon
                            key={`dynamicButton_${i}`}
                            faIcon={e.faIcon}
                            handleClick={() => {
                                e.handleClick(props.index);
                            }} />
                    ))
                }
            </View>
        );
    } else {
        return (
            <View key={`dynamicItem_${props.index}`} style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginTop: 10,
                alignItems: 'center',
                height: props.height
            }}>
                <Text style={{
                    fontSize: SizeScheme.get().font.d,
                    fontWeight: 'bold',
                    color: ColorScheme.get().secondary
                }}>
                    {props.index+1}
                </Text>
                <View style={{ flex: 1, paddingHorizontal: 5 }}>
                    {props.children}
                </View>
                <ButtonIcon
                    faIcon={faEllipsisVertical}
                    handleClick={() => {
                        props.openShowOptions(props.index);
                    }} />
            </View>
        );
    }
}