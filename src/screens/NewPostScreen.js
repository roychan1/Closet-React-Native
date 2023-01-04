import React, { useState, useContext } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Header, Icon } from '@rneui/themed';
import * as FileSystem from 'expo-file-system';
import { Context as UserIDContext } from '../contexts/UserIDContext';
import axios from 'axios';
import CONSTANTS from '../Constants';

// const jwt = require('jsonwebtoken');

//TODO:
// - fix photo aspect ratio to 3:4
// - make asking media library permission speicific to android and ios10
// - make back button retrace navigation stack rather than navigate


export default function NewPostScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusCamera, requestPermissionCamera] = ImagePicker.useCameraPermissions();
    const [statusMediaLibrary, requestPermissionMediaLibrary] = ImagePicker.useMediaLibraryPermissions();
    const userID = useContext(UserIDContext);

    const launchCamera = async() => {
        let result = await ImagePicker.launchCameraAsync({
            quality: 1,
        })

        if (!result.cancelled) {
            setImage(result.uri);
        }
    }

    const noCameraPermissionAlert = () => {
        Alert.alert(
            "",
            "Camera permission must be enabled to take a photo.",
            [
                {
                    text: "OK",
                    style: "cancel"
                }
            ]
        );
    }

    const noImageLibraryPermissionAlert = () => {
        Alert.alert(
            "",
            "Media Library permission must be enabled to pick an image.",
            [
                {
                    text: "OK",
                    style: "cancel"
                }
            ]
        );
    }

    const pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })
        .catch(function(error) {
            noImageLibraryPermissionAlert();
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    }

    const getCameraPermission = () => {
        return new Promise(async function(resolve, reject) {
            await requestPermissionCamera()
            .then(function(response) {
                if (response.granted) {
                    resolve();
                } else {
                    reject();
                }
            })
            .catch(function(error) {
                console.error("getCameraPermission: something went wrong ")
                console.error(error)
            })
        })
    }

    const getMediaLibraryPermission = () => {
        return new Promise(async function(resolve, reject) {
            await requestPermissionMediaLibrary()
            .then(function(response) {
                if (response.granted) {
                    resolve();
                } else {
                    reject();
                }
            })
            .catch(function(error) {
                console.error("getMediaLibraryPermission: something went wrong ")
                console.error(error)
            })
        })
    }
    
    const takePhoto = async() => {
        if (statusCamera.status === 'undetermined') {
            try {
                await getCameraPermission();
                await getMediaLibraryPermission();
                await launchCamera();
            } catch(error) {
                noCameraPermissionAlert();
            }
        } else if (statusCamera.granted && statusMediaLibrary.granted) {
            await launchCamera();
        } else {
            noCameraPermissionAlert();
        }
    }

    const upload = async() => {
        //get tags
        let image_base64;
        setLoading(true);

        if (image) {
            await FileSystem.readAsStringAsync(image, {encoding: FileSystem.EncodingType.Base64})
            .then(data => {
                image_base64 = data
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            return;
        }

        const body = {
            image_base64
        }
        const config = {
            headers: {
                'Content-Type': 'image/jpeg'
            }
        }
        axios.post(
            CONSTANTS.SERVER_BASE_URL + '/upload',
            body,
            config,
        )
        .then(function(response) {
            // console.log(response);
            Alert.alert(
                "", 
                "Image successfully uploaded!", 
                [{
                    text: 'Close', 
                    style: 'cancel',
                    onPress: () => {
                        setImage(null);
                        navigation.goBack();
                    }
                }]
            );
        })
        .catch(function(error) {
            // console.log(error)
        })
        .finally(function() {
            setLoading(false);
        })

        
        // const body = {
        //     userID: userID.state,
        //     tags: [],
        //     image: image_base64,
        //     timestamp: Date.now()
        // }

        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }

        // axios.post(
        //     CONSTANTS.SERVER_BASE_URL + '/addpost',
        //     body,
        //     config
        // )
    }

    return (
        <View style={styles.view} pointerEvents={loading ? 'none' : 'auto'}>
            {loading && <View style={styles.viewActivityIndicator}><ActivityIndicator/></View>}
            <Header
                leftComponent={
                    <TouchableOpacity style={styles.back} onPress={() => {navigation.goBack()}}>
                        <Icon name='chevron-left' type='feather' color='black' size={35} />
                    </TouchableOpacity>
                }
                containerStyle={styles.header}
            />
            <View style={styles.viewMain}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.textButton}>Select an image from gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Text style={styles.textButton}>Take a photo</Text>
                </TouchableOpacity>
                <View style={styles.viewImageBorder}>
                    { !image &&
                        <Text style={{color: 'rgba(0, 0, 0, 0.2)', ...styles.buttonText}}>Image to upload</Text>
                    }
                    { image &&
                        <View style={styles.viewImage}>
                            <Image source={{uri: image}} style={styles.image} />
                        </View>
                    }
                </View>
                <TouchableOpacity style={styles.buttonUpload} onPress={upload}>
                    <Text style={styles.textButton}>Upload</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    back: {
        
    },
    button: {
        borderWidth: 1,
        height: 30,
        marginHorizontal: 50,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonUpload: {
        borderWidth: 1,
        height: 30,
        marginHorizontal: 50,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    header: {
        alignItems: 'flex-start',
        borderBottomWidth: 0,
        height: 90,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        zIndex: 100,        // works for ios
        elevation: 100,     // works for android
    },
    image: {
        width: '100%',
        height: '100%',
        // aspectRatio: 3/4,
        resizeMode: 'contain'
    },
    textButton: {
        fontSize: 15,
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    viewActivityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,    //works for ios
        elevation: 100, //works for android
    },
    viewImage: {
        flex: 1,
        padding: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewImageBorder: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        marginHorizontal: 50,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewMain: {
        flex: 1,
        alignSelf: 'stretch',
        paddingBottom: 20,
    }
})