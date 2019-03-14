import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import { Container , Text , Content , View , Textarea , Icon} from 'native-base'
import { Image , TouchableOpacity } from 'react-native';
import {scale, verticalScale} from "react-native-size-matters";
import Connection from "../../../helper/Connection";
import Identify from "../../../helper/Identify";
import NavigationManager from "../../../helper/NavigationManager";

export default class InputAddress extends AbstractComponent{
    constructor(props){
        super(props)
        this.currentPosition = this.props.navigation.getParam('currentPosition');
        this.destinationPosition = this.props.navigation.getParam('destinationPosition');
        this.lat = this.props.navigation.getParam('lat');
        this.long = this.props.navigation.getParam('long');
        this.parent = this.props.navigation.getParam('parent');
        this.state = {
            placeNow: this.currentPosition,
            destinationWantToGet: this.destinationPosition,
            isInputPlace: false,
            isInputDestination: false,
            resultAutoFill: null
        }
    }
    renderMarker(){
        return(
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Image resizeMode={'contain'} style={{width: 25, height: 25, aspectRatio: 1}} source={require('../../../../media/Images/current.png')}/>
                <View style={{height: verticalScale(35), justifyContent: 'center', alignItems: 'center'}}>
                    <Image resizeMode={'contain'} style={{width: 7, height: verticalScale(20)}}  source={require('../../../../media/Images/dashborder.png')}/>
                </View>
                <Image resizeMode={'contain'} style={{width: 25, height: 25, aspectRatio: 1}} source={require('../../../../media/Images/destination.png')}/>
            </View >
        )
    }
    renderInputSec(){
        return(
            <View
                style={{
                    marginTop: 60,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    padding: 30
                }}
            >
                {this.renderMarker()}
                <View
                    style={{
                        flexGrow: 1,
                        marginLeft: 15
                    }}
                >
                    <View
                        style={{
                            flexGrow: 1,
                            width: '100%',
                            borderBottomWidth: 1,
                            borderBottomColor: '#f1f1f1',
                            justifyContent: 'center'
                        }}>
                        <Textarea
                            returnKeyType={'done'}
                            clearTextOnFocus
                            rowSpan={2}
                            defaultValue={this.state.placeNow}
                            placeholder={'Nhập điểm '}
                            onChangeText={text => {
                                this.setState({placeNow: text, isInputPlace: true, isInputDestination: false})
                                this.requestAutoFill(text)
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexGrow: 1,
                            width: '100%',
                            justifyContent: 'center'
                        }}>
                        <Textarea
                            returnKeyType={'done'}
                            clearTextOnFocus
                            style={{
                                marginTop: 15
                            }}
                            rowSpan={2}
                            defaultValue={this.state.destinationWantToGet}
                            placeholder={'Nhập điểm đến'}
                            onChangeText={text => {
                                this.setState({destinationWantToGet: text , isInputPlace: false, isInputDestination: true})
                                this.requestAutoFill(text)
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }
    requestAutoFill(text){
        let token = Identify.makeid()
        Connection.setGetData({
            input: text,
            sessiontoken: token,
            types: 'address',
            radius : 5000,
            location: this.lat + ',' + this.long
        }, true)
        Connection.connect('place/queryautocomplete/json', this)
    }
    setData(data){
        this.setState({
            resultAutoFill: data.predictions
        })
    }
    renderResultAutoFill(){
        if(this.state.resultAutoFill){
            let list = []
            this.state.resultAutoFill.forEach(place => {
                let address = Identify.formatAddress(place)
                list.push(
                    <TouchableOpacity
                        onPress={() => {
                            let key = 'placeNow';
                            if(this.state.isInputDestination){
                                key = 'destinationWantToGet'
                            }
                            this.state[key] = place.description
                            if(this.state.placeNow !== '' && this.state.destinationWantToGet !== ''){
                                NavigationManager.backToPreviousPage(this.props.navigation)
                                this.parent.setState({currentLocation: this.state.placeNow, destinationPosition: this.state.destinationWantToGet})
                            }
                        }}
                        key={Identify.makeid()}
                        style={{
                            padding: 16,
                            borderBottomColor: '#c3c3c3',
                            borderBottomWidth: 0.5,
                            backgroundColor: 'white'
                        }}
                    >
                        <Text style={{fontWeight: '500'}}>{address.mainAddress}</Text>
                        <Text style={{fontSize: 13, color: '#828282', marginTop: 10}}>{address.description}</Text>
                    </TouchableOpacity>
                )
            })
            return <Content
                style={{
                    paddingTop: 40,
                    backgroundColor: '#f1f1f1'
                }}
            >
                {list}
            </Content>
        }
    }
    createLayout(){
        return(
            <Container
                style={{
                    backgroundColor: 'white',
                    height: 150
                }}
            >
                <Content
                    style={{
                        flex: 1
                    }}
                >
                    {this.renderInputSec()}
                    {this.renderResultAutoFill()}
                </Content>
            </Container>
        )
    }
}