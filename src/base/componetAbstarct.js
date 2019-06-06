import React from 'react';
import { Dimensions , Platform , Alert , BackHandler } from 'react-native';
import { Container , Header , Left , View , Right , Body , Spinner } from 'native-base'
import ThumbAction from "./thumbAction";

export default class AbstractComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showLoading: 'none'
        };
        if(Platform.OS === 'android'){
            this.props.navigation.addListener(
                'didFocus',
                () => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackAndroid);
                }
            );
            this.props.navigation.addListener(
                'willBlur',
                () => {
                    BackHandler.removeEventListener('hardwareBackPress', this.handleBackAndroid)
                }
            );
        }
    }
    handleBackAndroid = () =>{
        if(this.props.navigation.state.routeName === 'Home' ||
            (this.props.navigation.state.hasOwnProperty('params') &&
                this.props.navigation.state.params.hasOwnProperty('previousRoute') &&
                this.props.navigation.state.params.previousRoute === 'Splash')
        ) {

            Alert.alert(
                'Cảnh báo',
                'Bạn có chắc muốn thoát ứng dụng' + '?',
                [
                    {
                        text: 'Không', onPress: () => {
                           console.log('NO exit')
                        }
                    },
                    {
                        text: 'Có', onPress: () => {
                        BackHandler.exitApp()
                    }
                    },
                ],
                {cancelable: true}
            )
            return true
        }
    }
    createLayout() {
        return null
    }
    showLoading(show = 'none', shouldCallSetState = true) {
        if (shouldCallSetState) {
            this.setState({ showLoading: show });
        } else {
            this.state.showLoading = show;
        }
    }
    render() {
        return (
            <Container >
                <Header
                    iosBarStyle={"dark-content"}
                    androidStatusBarColor="rgba(0,0,0,0.251)"
                    transparent
                    noShadow
                >
                    <Left>
                        <ThumbAction navigation={this.props.navigation}/>
                    </Left>
                    <Body/>
                    <Right/>
                </Header>
                <View style={{ flex: 1 , zIndex: -1}}>
                    {this.createLayout()}
                    {this.state.showLoading !== 'none' &&
                    <View
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: this.state.showLoading == 'full' ? 'white' : '#00000033',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Spinner color={"#20bf6b"} />
                    </View>}
                </View>
            </Container>
        );
    }
}