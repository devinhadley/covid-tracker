import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    Animated,
    StyleSheet,
    Dimensions,
    Button,
    Linking,
    Modal,
    Pressable,
} from 'react-native';
import Emoji from 'react-native-emoji';
import {LineChart} from 'react-native-chart-kit';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function roundHundreths(value) {
    return Math.ceil(value * 100) / 100;
}

const Home = ({navigation, route, locationData, setLocationData}) => {
    const [covidData, setCovidData] = useState(null);

    const [covidDataChange, setCovidDataChange] = useState(null);

    const [usCovidData, setUsCovidData] = useState(null);

    const [usCovidDataChange, setUsCovidDataChange] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    // Fetch Tasks
    useEffect(() => {
        const getUSDataFromAPI = () => {
            return fetch('https://api.covidtracking.com/v1/us/daily.json')
                .then((response) => response.json())
                .then((json) => {
                    setUsCovidData(json);
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        const getDataFromAPI = (abbr) => {
            return fetch(
                'https://api.covidtracking.com/v1/states/' +
                    abbr +
                    '/daily.json',
            )
                .then((response) => response.json())
                .then((json) => {
                    setCovidData(json);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        getDataFromAPI(locationData.abbr);
        getUSDataFromAPI();
    }, []); // <-- empty dependency array

    const setCovidChange = () => {
        setCovidDataChange(
            roundHundreths(
                ((covidData[0].positiveIncrease -
                    covidData[1].positiveIncrease) /
                    covidData[1].positiveIncrease) *
                    100,
            ),
        );
    };

    const setUsChange = () => {
        setUsCovidDataChange(
            roundHundreths(
                ((usCovidData[0].positiveIncrease -
                    usCovidData[1].positiveIncrease) /
                    usCovidData[1].positiveIncrease) *
                    100,
            ),
        );
    };

    covidData != null && covidDataChange == null ? setCovidChange() : null;
    const setUsCovidChange = () => {};

    usCovidData != null && usCovidDataChange == null ? setUsChange() : null;

    const FadeInView = (props) => {
        const fadeAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(fadeAnim, {
                useNativeDriver: true,
                toValue: 1,
                duration: 1000,
            }).start();
        }, [fadeAnim]);

        return (
            <Animated.View // Special animatable View
                style={{
                    ...props.style,
                    opacity: fadeAnim, // Bind opacity to animated value
                }}>
                {props.children}
            </Animated.View>
        );
    };

    const resetLocationData = () => {

        setModalVisible(false)

        AsyncStorage.clear()

        setLocationData('config')



    }

    return (
        <FadeInView
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {covidData != null && usCovidData != null ? (
                <>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(false);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>
                                    Settings
                                </Text>

                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() =>
                                        resetLocationData()
                                    }>
                                    <Text style={styles.textStyle}>
                                        Change active state.
                                    </Text>
                                </Pressable>

                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() =>
                                        setModalVisible(!modalVisible)
                                    }>
                                    <Text style={styles.textStyle}>
                                        Close
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <View style={{position: 'absolute', right: 5, top: 5}}>
                        <Button
                            style={{}}
                            onPress={() => setModalVisible(true)}
                            title="Settings"></Button>
                    </View>
                    <Text style={{fontSize: 30}}>{locationData.name}</Text>
                    <Text style={{fontSize: 18}}>
                        There are {covidData[0].positiveIncrease} new cases
                        today.{' '}
                    </Text>
                    {Math.sign(covidDataChange) == 1 ? (
                        <Text style={{color: 'red'}}>
                            {Math.abs(covidDataChange)}% increase.
                        </Text>
                    ) : (
                        <Text style={{color: 'green'}}>
                            {Math.abs(covidDataChange)}% decrease.
                        </Text>
                    )}
                    <Text style={{marginTop: 10}}>
                        {locationData.name} 30 Day Chart
                    </Text>
                    <LineChart
                        data={{
                            labels: covidData
                                .slice(0, 30)
                                .reverse()
                                .map((data, index) =>
                                    index % 2 == 0
                                        ? data.date.toString().substr(6, 8)
                                        : '',
                                ),

                            datasets: [
                                // Use .map to get an array of positiveIncreases
                                {
                                    data: covidData
                                        .slice(0, 30)
                                        .reverse()
                                        .map((data) => data.positiveIncrease),
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 20} // from react-native
                        height={Dimensions.get('window').height * .25}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: '#0269A4',
                            backgroundGradientFrom: '#0269A4',
                            backgroundGradientTo: '#0269A4',
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '2',
                                strokeWidth: '1',
                                stroke: '#ffa726',
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                            marginBottom : -20,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 40,
                        }}>
                        <Text style={{fontSize: 30}}>United States</Text>
                    </View>
                    <Text style={{fontSize: 18}}>
                        There are {usCovidData[0].positiveIncrease} new cases.
                    </Text>
                    {Math.sign(usCovidDataChange) == 1 ? (
                        <Text style={{color: 'red'}}>
                            {Math.abs(usCovidDataChange)}% increase.
                        </Text>
                    ) : (
                        <Text style={{color: 'green'}}>
                            {Math.abs(usCovidDataChange)}% decrease.
                        </Text>
                    )}

                    <Text style={{marginTop: 10}}>
                        United States 30 Day Chart
                    </Text>
                    <LineChart // Us 30-Day Covid Graph
                        data={{
                            labels: usCovidData
                                .slice(0, 30)
                                .reverse()
                                .map((data, index) =>
                                    index % 2 == 0
                                        ? data.date.toString().substr(6, 8)
                                        : '',
                                ),

                            datasets: [
                                // Use .map to get an array of positiveIncreases
                                {
                                    data: usCovidData
                                        .slice(0, 30)
                                        .reverse()
                                        .map((data) => data.positiveIncrease),
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 20} // from react-native
                        height={Dimensions.get('window').height * .25} // Becomes 25%% of the height.
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: '#0269A4',
                            backgroundGradientFrom: '#0269A4',
                            backgroundGradientTo: '#0269A4',
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '2',
                                strokeWidth: '1',
                                stroke: '#ffa726',
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                    <Text
                        style={{fontSize: 10, color: '#0000FF'}}
                        title=""
                        onPress={() =>
                            Linking.openURL(
                                'https://covidtracking.com/about-data/license',
                            )
                        }>
                        Data provided by the Covid Tracking Project
                    </Text>
                </>
            ) : (
                <Text>Loading....</Text>
            )}
        </FadeInView>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        margin: 20,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: 30,
        marginBottom: 15,
        textAlign: 'center',
    },
});
export default Home;
