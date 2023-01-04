import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Header, Icon } from '@rneui/themed';

export default function ProfileScreen({ navigation }) {
    return (
        <View>
            <Header
                leftComponent={
                    <TouchableOpacity style={styles.back} onPress={() => {navigation.goBack()}}>
                        <Icon name='chevron-left' type='feather' color='black' size={35} />
                    </TouchableOpacity>
                }
                containerStyle={styles.header}
            />
            <Text style={styles.textHandle}>@user123</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'flex-start',
        borderBottomWidth: 0,
        height: 90,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        zIndex: 100,        // works for ios
        elevation: 100,     // works for android
    },
    textHandle: {
        fontSize: 32,
        marginHorizontal: 20,   //no vertical b/c space-around overrides
        color: 'rgba(0, 0, 0, 1)',
        textAlign: 'left',
        alignSelf: 'stretch'
    }
})