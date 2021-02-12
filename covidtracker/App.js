import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Button} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './components/Home';
import Configure from './components/Configure';
import Loading from './components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

//AsyncStorage.clear();

const Stack = createStackNavigator();

const App = () => {
    const [locationData, setLocationData] = useState(null); // Prevent un neccessary routing to config in launch.

    useEffect(() => {
        const data = AsyncStorage.getItem('@location_data');
        data.then((data) =>
            data == null
                ? setLocationData('config')
                : setLocationData(JSON.parse(data)),
        );
    }, []); // <-- empty dependency array

    return (
        // The state of data dictates the routing of the application.
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={(route) => ({
                    //                    headerShown: false,
                    initialRoute: 'Home',
                })}>
                {locationData == 'config' ? (
                    <Stack.Screen
                        name="Configure"
                        component={Configure}
                        initialParams={{setLocationData: setLocationData}}
                        options={{
                            header: () => null,
                        }}
                    />
                ) : locationData ? (
                    <Stack.Screen
                        name="Home"
                        options={{
                            title: "Today's Impact",
                            headerTitleStyle: {fontSize: 25},
                        }}>
                        {(props) => (
                            <Home
                                {...props}
                                setLocationData={setLocationData}
                                locationData={locationData}
                            />
                        )}
                    </Stack.Screen>
                ) : !locationData ? (
                    <Stack.Screen name="Loading" component={Loading} />
                ) : (
                    <Stack.Screen name="Loading" component={Loading} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default App;
