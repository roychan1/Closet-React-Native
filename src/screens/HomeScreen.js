import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewPostScreen from './NewPostScreen';
import HomeScreenComponent from './HomeScreenComponent';


export default HomeScreen = () => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator screenOptions={{headerShown: false}}>
            <Drawer.Screen name="Home" component={HomeScreenComponent} />
            <Drawer.Screen name="Add New Post" component={NewPostScreen} />
        </Drawer.Navigator>
    );
}