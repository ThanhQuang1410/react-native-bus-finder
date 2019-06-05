import React from 'react';
import NavigationManager from "../../../helper/NavigationManager";

import firebase from 'firebase';

export default class Redirect extends React.Component{
    checkIfLogIn = () => {
        firebase.auth().onAuthStateChanged(function (user){
            console.log(user)
            if(user){
                NavigationManager.openRootPage(this.props.navigation, 'Home')
            }else {
                NavigationManager.openRootPage(this.props.navigation, 'Login')
            }
        }.bind(this))
    };
    componentDidMount(){
        this.checkIfLogIn()
    }
    render(){
        return null
    }
}