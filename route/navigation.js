import React, { Component } from "react";
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Splash from '../src/screen/splash/pages'
import Home from '../src/screen/Home/pages'
import InputAddress from '../src/screen/InputSection/pages'
import Login from '../src/screen/Customer/pages'
import Register from '../src/screen/Customer/pages/register'
const Stack = createStackNavigator(
    {
        Splash: { screen: Splash },
        Home: { screen: Home},
        InputAddress: {screen: InputAddress},
        Login: {screen: Login},
        Register: {screen: Register},
    },
    {
        headerMode: 'none'
    }
);
Stack.navigationOptions = ({ navigation }) => {
    let drawerLockMode = 'unlocked';
    let screenWantDisable = ['Login', 'Register']; //screen want to disable drawer
    let route = navigation.state.routes;
    screenWantDisable.forEach(screen => {
        route.forEach(routeName => {
            if (routeName.routeName === screen) {
                drawerLockMode = 'locked-closed';
            }
        })
    })

    return {
        drawerLockMode,
    };
};
const Router = createDrawerNavigator(
    {
        Splash: { screen: Splash },
        Stack: { screen: Stack }
    },
    {
        // contentComponent: props => <Drawer {...props} />,
        initialRouteName: 'Splash',
    }
);
export default Router;