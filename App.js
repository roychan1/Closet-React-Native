import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import LoginScreen from './src/screens/LoginScreen';
import { Provider as NeedNewCardContextProvider } from './src/contexts/NeedNewCardContext';
import { Provider as UserIDContextProvider } from './src/contexts/UserIDContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <UserIDContextProvider>
      <NeedNewCardContextProvider>
        <SafeAreaView style={{flex: 1}}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" translucent={true} />
            <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{headerShown: false}}>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="SearchScreen" component={SearchScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </NeedNewCardContextProvider>
    </UserIDContextProvider>
  );
}
