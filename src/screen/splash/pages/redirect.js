import React from 'react';
import NavigationManager from "../../../helper/NavigationManager";

import firebase from 'firebase';

export default class Redirect extends React.Component{
    checkIfLogIn = () => {
        firebase.auth().onAuthStateChanged(function (user){
            console.log(user)
            if(user){
                let dataStore = {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL : user.photoURL,
                    createdTime : user.metadata.creationTime,
                    lastSignInTime : user.metadata.lastSignInTime,
                };
                firebase.database().ref('/users/' + user.uid).set(dataStore).then(() => {
                    NavigationManager.openRootPage(this.props.navigation, 'Home', {customerData: dataStore})
                });
            }else {
                NavigationManager.openRootPage(this.props.navigation, 'Login')
            }
        }.bind(this))
    };
    componentDidMount(){
        this.checkIfLogIn();
    }
    render(){
        return null
    }
}