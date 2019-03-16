/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Root} from 'native-base'
import AppRouter from './route/navigation'
import reducers from './reducers'
import { Alert } from  'react-native'
import RNRestart  from 'react-native-restart'
import RNExitApp from 'react-native-exit-app';
const store = createStore(reducers);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
    }

    componentWillMount(){
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const { latitude, longitude } = coords;
                let data = {
                    position: {
                        latitude,
                        longitude,
                    },
                    region: {
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.001,
                    }
                }
                store.dispatch({ type: 'current_location', data: data });
            },
            (error) => {
                console.log(error)
                Alert.alert(
                    'Có lỗi xảy ra',
                    'Hãy đảm bảo rằng bạn đã bật kết nối Internet hoặc cho phép ứng dụng sử dụng vị ',
                    [
                        {
                            text: 'Thử lại',
                            onPress: () => {
                                RNRestart.Restart()
                            }
                        },
                        {
                            text: 'Thoát ứng dụng',
                            onPress: () => {
                                RNExitApp.exitApp();
                            }
                        },
                    ],
                    { cancelable: false }
                );

            },
            { enableHighAccuracy: false, timeout: 3600000, maximumAge: 1000 }
        )
    }
    render() {
        return (
            <Provider store={store}>
                <Root>
                    <AppRouter />
                </Root>
            </Provider>
        );
    }
}
