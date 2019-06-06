import React from 'react'
import { Container, View , Text , Spinner } from 'native-base';
import { Image } from 'react-native'
import ComponectAbstract from '../../../base/componetAbstarct'
import { connect } from 'react-redux'
import NavigationManager from "../../../helper/NavigationManager";
import firebase from 'firebase'
import Redirect from "./redirect";
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
                        style={{ width: 200 , height: 200}}
                        source={require("../../../../media/Images/personal_logo.png")}/>
                </Container>
            )
        }else {
            return  <Redirect navigation={this.props.navigation}/>
        }

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