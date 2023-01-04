import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, InteractionManager } from 'react-native';
import { Header, Icon } from "@rneui/themed";
import Card from "../components/Card";
// import HeaderBox from "../components/HeaderBox";
import { Context as NeedNewCardContext } from "../contexts/NeedNewCardContext";

// TODO:
// - fix card resizing width first second when launched on android emulator (no longer have issue)

export default HomeScreenComponent = ({ navigation }) => {
    const needNewCard = useContext(NeedNewCardContext);
    const [cardSlot, setCardSlot] = useState([]);

    useEffect(() => {
        //for proper pan animation
        InteractionManager.runAfterInteractions(() => {
            if (!needNewCard.state) {
                setCardSlot([1]);
                // setCardSlot([{key: '1', item: 1}]);
            } else {
                setCardSlot([]);
            }
        })
    }, [needNewCard.state]);

    return (
        <View style={styles.home}>
            <Header
                leftComponent={
                    <TouchableOpacity style={styles.menu} onPress={() => {navigation.openDrawer();}}>
                        <Icon name='menu' type='feather' color='black' size={35} />
                    </TouchableOpacity>
                }
                rightComponent={
                    <TouchableOpacity style={styles.profile} onPress={() => {navigation.navigate("ProfileScreen");}}>
                        <Icon name='user' type='feather' color='black' size={35} />
                    </TouchableOpacity>
                }
                containerStyle={styles.header}
            />
            <View style={styles.viewCard}>
                {cardSlot.map((num) => (
                    <Card key={num} id={num}/>
                ))}
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.search} onPress={() => {navigation.navigate("SearchScreen")}}>
                    <Icon name='search' type='feather' color='black' size={35} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        alignItems: 'flex-start'
    },
    header: {
        alignItems: 'flex-start',
        borderBottomWidth: 0,
        height: 90,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        zIndex: 100,    //works for ios
        elevation: 100, //works for android
    },
    home: {
        flex: 1,
        backgroundColor: 'white'
    },
    menu: {
        
    },
    profile: {

    },
    search: {
        margin: 15,
    },
    viewCard: {
        flex: 1,
        backgroundColor: 'white',
        alignSelf: 'stretch',
    }
})