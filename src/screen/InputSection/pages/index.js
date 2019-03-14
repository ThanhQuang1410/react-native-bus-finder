import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import { Container , Text , Content , View , Input , Item} from 'native-base'
import { Image , TouchableOpacity } from 'react-native';
import {scale, verticalScale} from "react-native-size-matters";
import Connection from "../../../helper/Connection";
import Identify from "../../../helper/Identify";
import NavigationManager from "../../../helper/NavigationManager";

export default class InputAddress extends AbstractComponent{
    constructor(props){
        super(props)
        this.currentPosition = this.props.navigation.getParam('currentPosition') ? this.props.navigation.getParam('currentPosition') : '';
        this.destinationPosition = this.props.navigation.getParam('destinationPosition') ? this.props.navigation.getParam('destinationPosition') : '';
        this.lat = this.props.navigation.getParam('lat');
        this.long = this.props.navigation.getParam('long');
        this.parent = this.props.navigation.getParam('parent');
        this.state = {
            currentLocation: this.currentPosition,
            destinationPosition: this.destinationPosition,
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
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    paddingBottom: 10,
                    paddingLeft: 30,
                    paddingRight: 30,
                }}
            >
                {this.renderMarker()}
                <View
                    style={{
                        flexGrow: 1,
                        marginLeft: 15,
                        flexDirection: 'column'
                    }}
                >
                    <Item>
                        <Input
                            numberOfLines={1}
                            returnKeyType={'done'}
                            defaultValue={this.state.currentLocation}
                            value={this.state.currentLocation}
                            placeholder={'Nhập điểm '}
                            style={{
                                fontSize: 13,
                                fontWeight: '500'
                            }}
                            onChangeText={text => {
                                this.setState({currentLocation: text, isInputPlace: true, isInputDestination: false})
                                this.requestAutoFill(text)
                            }}
                        />
                    </Item>
                    <Item
                        style={{
                            borderColor: 'transparent'
                        }}
                    >
                        <Input
                            numberOfLines={1}
                            returnKeyType={'done'}
                            style={{
                                marginTop: 15,
                                fontSize: 13,
                                fontWeight: '500'
                            }}
                            defaultValue={this.state.destinationPosition}
                            value={this.state.destinationPosition}
                            placeholder={'Nhập điểm đến'}
                            onChangeText={text => {
                                this.setState({destinationPosition: text , isInputPlace: false, isInputDestination: true})
                                this.requestAutoFill(text)
                            }}
                        />
                    </Item>
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
                let address = Identify.formatAddress(place.description)
                list.push(
                    <TouchableOpacity
                        onPress={() => {
                            let key = 'currentLocation';
                            if(this.state.isInputDestination){
                                key = 'destinationPosition'
                            }
                            this.setState({
                                [key] : place.description
                            })
                            if(this.state.currentLocation !== '' && this.state.destinationPosition !== ''){
                                if(key === 'currentLocation'){
                                    this.parent.setState({
                                        [key] : this.state[key],
                                        currentLocation: place.description
                                    })
                                }else {
                                    this.parent.setState({
                                        [key] : this.state[key],
                                        destinationPosition: place.description
                                    })
                                }
                                NavigationManager.backToPreviousPage(this.props.navigation)
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
                        <Text style={{fontWeight: '500', fontSize: 13}}>{address.mainAddress}</Text>
                        <Text style={{fontSize: 11, color: '#828282', marginTop: 10}}>{address.description}</Text>
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
                scrollEnabled={false}
            >
                {this.renderInputSec()}
                <Content
                    style={{
                        flex: 1
                    }}
                >
                    {this.renderResultAutoFill()}
                </Content>
            </Container>
        )
    }
}