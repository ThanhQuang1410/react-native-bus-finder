import React from 'react'
import { Container, View , Text , Spinner } from 'native-base';
import { Image } from 'react-native'
import ComponectAbstract from '../../../base/componetAbstarct'
import { connect } from 'react-redux'
import NavigationManager from "../../../helper/NavigationManager";
import Redirect from "./redirect";
class Splash extends ComponectAbstract{
    static navigationOptions = () => {
        let drawerLockMode = 'locked-closed';
        return {
            drawerLockMode,
        };
    };
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
            NavigationManager.openRootPage(this.props.navigation, 'Home')
            return null
        }

    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.current_location };
}
// export default Splash;
export default connect(mapStateToProps)(Splash);