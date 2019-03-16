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
        this.currentLocation = this.props.navigation.getParam('currentLocation') ? this.props.navigation.getParam('currentLocation') : '';
        this.destinationLocation = this.props.navigation.getParam('destinationLocation') ? this.props.navigation.getParam('destinationLocation') : '';
        this.lat = this.props.navigation.getParam('lat');
        this.long = this.props.navigation.getParam('long');
        this.parent = this.props.navigation.getParam('parent');
        this.state = {
            currentLocation: this.currentLocation,
            currentLocationLatLong: undefined,
            destinationPosition: this.destinationLocation,
            destinationPositionLatLong: undefined,
            isInputPlace: false,
            isInputDestination: false,
            isUserChangeCurrentLocation: false,
            resultAutoFill: null,

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
                            onFocus= {() => this.setState({currentLocation : ''})}
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
                                this.setState({
                                    currentLocation: text,
                                    isInputPlace: true,
                                    isInputDestination: false,
                                    isUserChangeCurrentLocation: true
                                });
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
                            onFocus= {() => this.setState({destinationPosition : ''})}
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
                                this.setState({
                                    destinationPosition: text ,
                                    isInputPlace: false,
                                    isInputDestination: true
                                })
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
        Connection.restData();
        Connection.setGetData({
            input: text,
            sessiontoken: token,
            types: 'address',
            radius : 5000,
            location: this.lat + ',' + this.long
        })
        Connection.connect('place/queryautocomplete/json', this)
    }
    requestGetLatLong(placeId){
        Connection.restData();
        Connection.setGetData({
            placeid: placeId
        });
        Connection.connect('place/details/json', this)
    }
    setData(data){
        if(data.hasOwnProperty('predictions')){
            this.setState({
                resultAutoFill: data.predictions
            })
        }else {
            if(!this.state.isUserChangeCurrentLocation){
                this.setState({
                    currentLocationLatLong: {
                        lat: this.lat,
                        lng: this.long
                    }
                })
                this.parent.setState({
                    currentLocationLatLong: {
                        lat: this.lat,
                        lng: this.long
                    }
                })
            }
            if(this.state.isInputDestination){
                this.setState({
                    destinationPositionLatLong: {
                        latitude: data.result.geometry.location.lat,
                        longitude: data.result.geometry.location.lng
                    }
                })
                this.parent.setState({
                    destinationPositionLatLong: {
                        latitude: data.result.geometry.location.lat,
                        longitude: data.result.geometry.location.lng
                    }
                })
            }
            if(this.state.isInputPlace){
                this.setState({
                    currentLocationLatLong: {
                        latitude: data.result.geometry.location.lat,
                        longitude: data.result.geometry.location.lng
                    }
                })
                this.parent.setState({
                    currentLocationLatLong: {
                        latitude: data.result.geometry.location.lat,
                        longitude: data.result.geometry.location.lng
                    }
                })
            }
            if(this.state.currentLocation !== '' && this.state.destinationPosition !== ''){
                this.parent.setState({
                    currentLocation: this.state.currentLocation,
                    destinationLocation: this.state.destinationPosition
                });
                NavigationManager.backToPreviousPage(this.props.navigation)
                this.parent.fitToMarker()
            }
        }
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
                            this.requestGetLatLong(place.place_id)
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