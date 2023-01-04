import React, { useState, useContext } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import CONSTANTS from '../Constants';
import axios from 'axios';
import { Context as UserIDContext } from '../contexts/UserIDContext';


const loginPressed = (login, password, userID, navigation) => {
    //sign in
    const body = {
        email: login,
        password
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    axios.post(
        CONSTANTS.SERVER_BASE_URL + '/signin',
        body,
        config
    )
    .then( function(response) {
        if (response.status === 200) {
            userID.setID(response.data.token);
            navigation.navigate("HomeScreen");
        } else {
            Alert.alert(
                "",
                "Non-200 status was returned",
                [
                    {
                        text: "Close",
                        style: "cancel"
                    }
                ]
            );
        }
    })
    .catch( function(error) {
        console.log(error)
        Alert.alert(
            "",
            "Incorrect credentials were provided.",
            [
                {
                    text: "Close",
                    style: "cancel"
                }
            ]
        );
    })
}

export default LoginScreen = ({ navigation }) => {
    const [login, onChangeLogin] = useState("test@test.com");
    const [password, onChangePassword] = useState("testpassword");
    const userID = useContext(UserIDContext);

    return (
        <View style={styles.view}>
            <Text style={styles.textTitle}>Closet</Text>
            <TextInput
                autoCapitalize='none'
                style={styles.input}
                value={login}
                onChangeText={onChangeLogin}
                placeholder={"Email Address"}
            />
            <TextInput
                autoCapitalize='none'
                secureTextEntry={true}
                style={styles.input}
                value={password}
                onChangeText={onChangePassword}
                placeholder={"Password"}
            />
            <TouchableOpacity
                style={styles.buttonLogin}
                onPress={() => {
                    loginPressed(login, password, userID, navigation);
                }}
            >
                <Text style={styles.textLogin}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonLogin: {
        borderWidth: 1,
        padding: 5,
        alignSelf: 'flex-start',
        marginLeft: 70,
        marginTop: 70,
        borderRadius: 5,
    },
    input: {
        height: 30,
        borderWidth: 1,
        marginHorizontal: 70,
        marginVertical: 10,
        paddingHorizontal: 5,
        alignSelf: 'stretch',
        borderRadius: 5,
    },
    textLogin: {
        fontSize: 15,
    },
    textTitle: {
        fontSize: CONSTANTS.TITLE_1_FONT_SIZE,
        color: 'rgba(255, 255, 255, 0.4)',
        alignSelf: 'flex-start',
        marginLeft: 70,
        marginBottom: 10,
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CONSTANTS.GRAY
    },

})