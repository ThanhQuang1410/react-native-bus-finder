import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import { Container , Text , Content , View , Input , Item , Button , Icon } from 'native-base'
import { Image , TouchableOpacity , Alert } from 'react-native';
import md5 from 'md5'
import firebase from 'firebase'
export default class Register extends AbstractComponent{
    constructor(props) {
        super(props);
        this.state = {
            emailBorder: '#c3c3c3',
            passwordBorder: '#c3c3c3',
            confirmPasswordBorder: '#c3c3c3',
            buttonEnable: false
        };
        this.validate = {
            email: false,
            password: false,
            confirmPassword: false
        };
        this.form = {
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    signUp(){
        let email = this.form.email;
        let password = this.form.password;
        let confirmPassword = this.form.confirmPassword;
        if(password !== confirmPassword){
            Alert.alert(
                'Lỗi',
                'Mật khẩu chưa được nhập giống nhau',
            );
        }else {
            password = md5(password);
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(res => {
                    console.log(res)
                })
                .catch(function(error) {
                    Alert.alert(
                        'Lỗi',
                        error.message,
                    );
            });
        }
    }
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
    validateEmail = (text) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(text).toLowerCase());
    };

    validateInput(text, key) {
        this.form[key] = text;
        let validateResult = false;
        if(key === 'email') {
            validateResult = this.validateEmail(text)
        } else if( key === 'password' || key === 'confirmPassword') {
            if(text.length >= 6) {
                validateResult = true;
            }
        } else {
           if(text !== ''){
               validateResult = true;
           }
        }
        this.validate[key] = validateResult;
        this.checkButton()

    }
    checkButton() {
        let buttonStatus = true;
        if (Object.keys(this.validate).length < Object.keys(this.form).length) {
            buttonStatus = false;
        } else {
            for (let key in this.validate) {
                let status = this.validate[key];
                if (status === false) {
                    buttonStatus = false;
                    break;
                }
            }
        }
        this.setState({
            buttonEnable: buttonStatus
        })
    }
    renderInput(stateKey, backGroundKey, placeHolder, icon) {
        return (
            <View>
                <Item
                    style={{
                        borderBottomColor: this.state[backGroundKey],
                        borderBottomWidth: 1,
                        marginBottom: 15,
                        paddingBottom: 7,
                        paddingLeft: 7
                    }}
                >
                    <Icon style={{color: '#c3c3c3'}} type='MaterialCommunityIcons' name={icon} />
                    <Input placeholder={placeHolder}
                           secureTextEntry={stateKey === 'password' || stateKey === 'confirmPassword'}
                           onBlur={ () => this.onBlur(backGroundKey) }
                           onFocus={ () => this.onFocus(backGroundKey) }
                           onChangeText={text => {
                               this.validateInput(text, stateKey)
                           }}
                    />
                </Item>
                {stateKey === 'password' &&
                <Text style={{fontSize: 13, color: '#c3c3c3'}}>Mật khẩu phải trên 6 ký tự</Text>
                }
                {stateKey === 'confirmPassword' &&
                <Text style={{fontSize: 13, color: '#c3c3c3'}}>Đảm bảo rằng bạn nhập lại đúng mật khẩu</Text>
                }
            </View>
        )
    }
    createLayout() {
        return (
            <Container>
                <View
                    style={{
                        marginLeft:30,
                        marginRight: 30,
                        marginTop: 60
                    }}
                >
                    {this.renderInput('email','emailBorder','Email', 'email-outline')}
                    {this.renderInput('password','passwordBorder','Mật khẩu', 'lock-outline')}
                    {this.renderInput('confirmPassword','confirmPasswordBorder','Nhập lại mật khẩu', 'lock-outline')}
                    <Button
                        disabled={!this.state.buttonEnable}
                        style={{
                            alignSelf: 'center',
                            backgroundColor: "#20bf6b",
                            width: '80%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.2,
                            shadowRadius: 15,
                            elevation: 20,
                            maxHeight: 45,
                            borderRadius: 5,
                            marginTop: 30,
                            justifyContent: 'center'
                        }}
                        onPress={() => {this.signUp()}}
                    >
                        <Text style={{color: 'white', fontWeight: '900', textAlign: 'center'}}>Đăng ký</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}
