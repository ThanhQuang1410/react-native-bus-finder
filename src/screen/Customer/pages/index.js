import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import { Container , Text , Content , View , Input , Item , Button , Icon } from 'native-base'
import { Image , TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import NavigationManager from "../../../helper/NavigationManager";
import {GoogleSigninButton, GoogleSignin} from 'react-native-google-signin'
export default class Login extends AbstractComponent{
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            emailStatus: false,
            passStatus: false,
            borderEmail: '#c3c3c3',
            borderPass: '#c3c3c3'
        };
        this.email = '';
        this.password = '';
    }
    componentDidMount(){
        GoogleSignin.configure({
            iosClientId: '398689985179-vg92rts6k75ou0s25ov1l6gta2dvqdt1.apps.googleusercontent.com',
        });
    }
    signIn () {
        this.showLoading('dialog');
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(() => {
                this.showLoading();
                NavigationManager.openRootPage(this.props.navigation, 'Home')
            })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            // ...
        });
    }
    validateEmail = (text) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = re.test(String(text).toLowerCase());
        this.setState({
            emailStatus: result
        })
    };
    onFocus(key) {
        this.setState({
            [key]: '#20bf6b'
        })
    }

    onBlur(key) {
        this.setState({
            [key]: '#c3c3c3'
        })
    }
    _signIn = () => {
        GoogleSignin
            .signIn()
            .then(data => {
                const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken,data.accessToken);
                return firebase.auth().signInWithCredential(credential)
            })
            .then(currentUser => {
                console.log(currentUser);
            })
            .catch(err => {
                console.log(err)
            })
    }
    render(){
        return(
            <Container
                scrollEnabled={false}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: '#ffffff'
                }}
            >

                <View
                    style={{
                        marginTop: 60,
                        marginLeft: 30,
                        marginRight: 30,
                        justifyContent: 'center'
                    }}
                >
                    <Image resizeMode={'contain'}
                           style={{ width: 150 , height: 150 , alignSelf: 'center'}}
                           source={require('../../../../media/Images/personal_logo.png')}/>
                    <Item
                        style={{
                            borderBottomColor: this.state.borderEmail,
                            borderBottomWidth: 1,
                            marginBottom: 15,
                            paddingBottom: 7,
                            paddingLeft: 7
                        }}
                    >
                        <Icon style={{color: '#c3c3c3'}} type='MaterialCommunityIcons' name='email-outline' />
                        <Input placeholder='Email'
                               autoCapitalize='none'
                               onBlur={ () => this.onBlur('borderEmail') }
                               onFocus={ () => this.onFocus('borderEmail') }
                               onChangeText={text => {
                                   this.email = text;
                                   this.validateEmail(text)
                               }}
                        />
                    </Item>
                    <Item
                        style={{
                            borderBottomColor: this.state.borderPass,
                            borderBottomWidth: 1,
                            marginBottom: 15,
                            paddingBottom: 7,
                            paddingLeft: 7
                        }}
                    >
                        <Icon style={{color: '#c3c3c3'}} type='MaterialCommunityIcons' name='lock-outline' />
                        <Input placeholder='Mật khấu'
                               secureTextEntry={true}
                               onBlur={ () => this.onBlur('borderPass') }
                               onFocus={ () => this.onFocus('borderPass') }
                               onChangeText={text => {
                                   this.password = text;
                                   if(text.length >= 6) {
                                       this.setState({
                                           passStatus: true
                                       })
                                   }
                               }}
                        />
                    </Item>
                    <Button
                        full
                        disabled={!this.state.emailStatus || !this.state.passStatus}
                        style={{
                            alignSelf: 'center',
                            backgroundColor: "#20bf6b",
                            width: '100%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.2,
                            shadowRadius: 15,
                            elevation: 20,
                            maxHeight: 45,
                            borderRadius: 5,
                            marginTop: 15
                        }}
                        onPress={() => {
                            this.signIn()
                        }}
                    >
                        <Text style={{color: 'white' }}>Đăng nhập</Text>
                    </Button>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginTop: 25
                        }}
                    >
                        <View style={{flexGrow: 1, height: '50%', borderBottomColor: '#7e7e7e', borderBottomWidth: 1}}/>
                        <Text style={{fontSize: 18, marginLeft: 7, marginRight: 7 }}>hoặc</Text>
                        <View style={{flexGrow: 1, height: '50%', borderBottomColor: '#7e7e7e', borderBottomWidth: 1}}/>
                    </View>
                    <GoogleSigninButton
                        style={{ width: '100%', height: 48 , marginTop: 25 , justifyContent: 'center', alignItems: 'center' , alignContent: 'center'}}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Light}
                        onPress={this._signIn}/>
                    <TouchableOpacity
                        style={{
                            marginTop: 35,
                            justifyItems: 'center'
                        }}
                        onPress={() => {
                            NavigationManager.openPage(this.props.navigation, 'Register')
                        }}
                    >
                        <Text style={{textAlign: 'center'}}>Không có tài khoản? <Text style={{color: "#20bf6b" }}>Đăng ký tại đây</Text></Text>
                    </TouchableOpacity>
                </View>

            </Container>
        )
    }
}