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
import {PermissionsAndroid} from  'react-native'

const store = createStore(reducers);

export default class App extends React.Component {
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
                        latitudeDelta: 0.0005,
                        longitudeDelta: 0.0001,
                    }
                }
                store.dispatch({ type: 'current_location', data: data });
            },
            (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
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
