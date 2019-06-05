import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import { Container , Text , Content , View , Input , Item , Button , Icon } from 'native-base'
import { Image , TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import NavigationManager from "../../../helper/NavigationManager";
const provider = new firebase.auth.GoogleAuthProvider();
export default class Login extends AbstractComponent{
    constructor(props) {
        super(props);
        this.state = {
            emailStatus: false,
            passStatus: false,
            borderEmail: '#c3c3c3',
            borderPass: '#c3c3c3',
            rememberMe: false
        };
        this.email = '';
        this.password = '';
    }
    signIn () {
        console.log(this.email)
        console.log(this.password)
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(() => {
            console.log('asda')
                NavigationManager.openRootPage(this.props.navigation, 'Home')
            })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
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
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                            marginBottom: 15
                        }}
                        onPress={() => {
                            this.setState(oldState => {
                                return {
                                    rememberMe: !oldState.rememberMe
                                }
                            })
                        }}
                    >
                        <Icon style={{color: "#20bf6b"}} name={this.state.rememberMe ? 'md-checkmark-circle-outline' : 'md-radio-button-off'}/>
                        <Text style={{marginLeft: 10}}>Nhớ mật khẩu</Text>
                    </TouchableOpacity>
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
                        <Text style={{color: 'white', fontWeight: '900'}}>Đăng nhập</Text>
                    </Button>
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