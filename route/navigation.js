import React, { Component } from "react";
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Splash from '../src/screen/splash/pages'
import Home from '../src/screen/Home/pages'
const Stack = createStackNavigator(
    {
        Splash: { screen: Splash },
        Home: {screen: Home}
    },
    {
        headerMode: 'none'
    }
)
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