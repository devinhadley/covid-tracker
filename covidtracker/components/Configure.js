import React, {useRef, useEffect} from 'react';
import {View, Text, Animated} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const items = [
    // Check google images for alphabetically ordered with abbreaviations.
    {
        id: 1,
        name: 'Alabama',
        abbr: 'al',
    },
    {
        id: 2,
        name: 'Alaska',
        abbr: 'ak',
    },
    {
        id: 3,
        name: 'Arizona',
        abbr: 'az',
    },
    {
        id: 4,
        name: 'Arkansas',
        abbr: 'ar',
    },
    {
        id: 5,
        name: 'California',
        abbr: 'ca',
    },
    {
        id: 6,
        name: 'Colorado',
        abbr: 'co',
    },
    {
        id: 7,
        name: 'Connecticut',
        abbr: 'ct',
    },

    {
        id: 8,
        name: 'Delaware',
        abbr: 'de',
    },

    {
        id: 9,
        name: 'Florida',
        abbr: 'fl',
    },

    {
        id: 10,
        name: 'Georgia',
        abbr: 'ga',
    },

    {
        id: 11,
        name: 'Hawaii',
        abbr: 'hi',
    },

    {
        id: 12,
        name: 'Idaho',
        abbr: 'id',
    },

    {
        id: 13,
        name: 'Illinois',
        abbr: 'il',
    },

    {
        id: 14,
        name: 'Indiana',
        abbr: 'in',
    },

    {
        id: 15,
        name: 'Iowa',
        abbr: 'ia',
    },
    {
        id: 16,
        name: 'Kansas',
        abbr: 'ks',
    },
    {
        id: 17,
        name: 'Kentucky',
        abbr: 'ky',
    },
    {
        id: 18,
        name: 'Louisiana',
        abbr: 'la',
    },
    {
        id: 19,
        name: 'Maine',
        abbr: 'me',
    },
    {
        id: 20,
        name: 'Maryland',
        abbr: 'md',
    },
    {
        id: 21,
        name: 'Massachusetts',
        abbr: 'ma',
    },
    {
        id: 22,
        name: 'Michigan',
        abbr: 'mi',
    },
    {
        id: 23,
        name: 'Minnesota',
        abbr: 'mn',
    },
    {
        id: 24,
        name: 'Mississippi',
        abbr: 'ms',
    },
    {
        id: 25,
        name: 'Missouri',
        abbr: 'mo',
    },
    {
        id: 26,
        name: 'Montana',
        abbr: 'mt',
    },
    {
        id: 27,
        name: 'Nebraska',
        abbr: 'ne',
    },
    {
        id: 28,
        name: 'Nevada',
        abbr: 'nv',
    },
    {
        id: 29,
        name: 'New Hampshire',
        abbr: 'nh',
    },
    {
        id: 30,
        name: 'New Jersey',
        abbr: 'nj',
    },
    {
        id: 31,
        name: 'New Mexico',
        abbr: 'nm',
    },
    {
        id: 32,
        name: 'New York',
        abbr: 'ny',
    },
    {
        id: 33,
        name: 'North Carolina',
        abbr: 'nc',
    },
    {
        id: 34,
        name: 'North Dakota',
        abbr: 'nd',
    },
    {
        id: 35,
        name: 'Ohio',
        abbr: 'oh',
    },
    {
        id: 36,
        name: 'Oklahoma',
        abbr: 'ok',
    },
    {
        id: 37,
        name: 'Oregon',
        abbr: 'or',
    },
    {
        id: 38,
        name: 'Pennsylvania',
        abbr: 'pa',
    },
    {
        id: 39,
        name: 'Rhode Island',
        abbr: 'ri',
    },
    {
        id: 40,
        name: 'South Carolina',
        abbr: 'sc',
    },
    {
        id: 41,
        name: 'South Dakota',
        abbr: 'sd',
    },
    {
        id: 42,
        name: 'Tennessee',
        abbr: 'tn',
    },
    {
        id: 43,
        name: 'Texas',
        abbr: 'tx',
    },
    {
        id: 44,
        name: 'Utah',
        abbr: 'ut',
    },
    {
        id: 45,
        name: 'Vermont',
        abbr: 'vt',
    },
    {
        id: 46,
        name: 'Virginia',
        abbr: 'va',
    },
    {
        id: 47,
        name: 'Washington',
        abbr: 'wa',
    },
    {
        id: 48,
        name: 'West Virgina',
        abbr: 'wv',
    },
    {
        id: 49,
        name: 'Wisconsin',
        abbr: 'wi',
    },
    {
        id: 50,
        name: 'Wyoming',
        abbr: 'wy',
    },
];

const FadeInView = (props) => { // Handels animation of view.
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
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

const Configure = ({navigation, route}) => {
    // Handeling the storage of state data.
    const storeData = async (value) => {
        try {
            const stringData = JSON.stringify(value);

            await AsyncStorage.setItem('@location_data', stringData);

            route.params.setLocationData(value);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <FadeInView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 30}}>Welcome.</Text>
            <SearchableDropdown
                onItemSelect={(item) => {
                    storeData(item);
                }}
                containerStyle={{padding: 5}}
                onRemoveItem={(item, index) => {
                    const items = this.state.selectedItems.filter(
                        (sitem) => sitem.id !== item.id,
                    );
                    this.setState({selectedItems: items});
                }}
                itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: '#ddd',
                    borderColor: '#bbb',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                itemTextStyle={{color: '#222'}}
                itemsContainerStyle={{maxHeight: 140}}
                items={items}
                //defaultIndex={0}
                resetValue={false}
                textInputProps={{
                    placeholder: 'Please select a state.',
                    underlineColorAndroid: 'transparent',
                    style: {
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                    },
                }}
                listProps={{
                    nestedScrollEnabled: true,
                }}
            />
        </FadeInView>
    );
};
export default Configure;
