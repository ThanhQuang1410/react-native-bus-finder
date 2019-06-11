import React from 'react'
import { View, TouchableOpacity , Linking } from 'react-native';
import { Icon, Text, ListItem, Thumbnail, Right } from 'native-base';
import NavigationManager from "../../helper/NavigationManager";
import firebase from 'firebase'
export default class ItemDrawer extends React.Component {
    onSelectItem(){
        if(this.props.data.hasOwnProperty('webView')){
            Linking.openURL(this.props.data.url)
        } else {
            if (this.props.data.route === 'LogOut') {
                firebase.auth().signOut().then(function() {
                    // Sign-out successful.
                    NavigationManager.openRootPage(this.props.navigation, 'Login')
                }).catch(function(error) {
                    // An error happened.
                });
            } else {
                NavigationManager.openRootPage(this.props.navigation, this.props.data.route)
            }
        }
    }
    render () {
        return (
            <TouchableOpacity
                onPress={() => { this.onSelectItem() }}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', marginRight: 30, alignItems: 'center' }}>
                    <Icon type='MaterialCommunityIcons' name={this.props.data.icon_name} style={{ color: '#20bf6b', fontSize: 22, width: 22 }} />
                    <Text style={{ marginLeft: 15, color: '#454545', paddingBottom: 0 }}>{this.props.data.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}