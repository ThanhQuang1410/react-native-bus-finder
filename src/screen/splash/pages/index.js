import React from 'react'
import { Container, View , Text , Spinner } from 'native-base';
import { Image } from 'react-native'
import ComponectAbstract from '../../../base/componetAbstarct'
import { connect } from 'react-redux'
import NavigationManager from "../../../helper/NavigationManager";
import firebase from 'firebase'
import Redirect from "./redirect";
import SplashScreen from 'react-native-splash-screen'

class Splash extends ComponectAbstract{
    static navigationOptions = () => {
        let drawerLockMode = 'locked-closed';
        return {
            drawerLockMode,
        };
    };
    componentDidMount(){
        firebase.database().ref('/app_configs/').once('value').then(function(snapshot) {
            this.props.storeData('app_config',snapshot.val())
        }.bind(this));
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
                        SplashScreen.hide();
                        NavigationManager.openRootPage(this.props.navigation, 'Home', {customerData: dataStore})
                    });
                });
            }else {
                SplashScreen.hide();
                NavigationManager.openRootPage(this.props.navigation, 'Login')
            }
        })
    }
    render(){
        if(!this.props.data){
            return(
                <Container style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff'
                }}>
                    <Image
                        resizeMode={'contain'}
                        style={{ width: 150 , height: 150}}
                        source={require("../../../../media/Images/bus.png")}/>
                </Container>
            )
        }
        return null;

    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.current_location };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
// export default Splash;
export default connect(mapStateToProps, mapDispatchToProps)(Splash);