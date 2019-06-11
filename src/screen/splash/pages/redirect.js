import React from 'react';
import NavigationManager from "../../../helper/NavigationManager";

import firebase from 'firebase';

export default class Redirect extends React.Component{
    componentWillMount(){
        NavigationManager.saveNavigation(this.props.navigation);
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user)
            if(user){
                let dataStore = {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL : user.photoURL,
                    createdTime : user.metadata.creationTime,
                    lastSignInTime : new Date().toString(),
                    uid: user.uid
                };
                firebase.database().ref('/users/' + user.uid).once('value').then((snapshot) => {
                    if(snapshot.exists()) {
                        dataStore = {
                            ...snapshot.val()
                        };
                        dataStore['lastSignInTime'] = new Date().toString();
                    }
                    console.log(dataStore)
                    firebase.database().ref('/users/' + user.uid).set(dataStore).then(() => {
                        NavigationManager.openRootPage(this.props.navigation, 'Home', {customerData: dataStore})
                    });
                });
            }else {
                NavigationManager.openRootPage(this.props.navigation, 'Login')
            }
        })
    }
    render(){
        return null
    }
}