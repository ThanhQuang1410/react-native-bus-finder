import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import { Container , Text , Content , View , Input , Item , Toast } from 'native-base'
import { Image , TouchableOpacity , Keyboard } from 'react-native';
import {scale, verticalScale} from "react-native-size-matters";
import Connection from "../../../helper/Connection";
import Identify from "../../../helper/Identify";
import NavigationManager from "../../../helper/NavigationManager";
import {connect} from "react-redux";
const polyline = require('@mapbox/polyline');

class InputAddress extends AbstractComponent{
    constructor(props){
        super(props)
        this.currentLocation = this.props.navigation.getParam('currentLocation') ? this.props.navigation.getParam('currentLocation') : '';
        this.destinationLocation = this.props.navigation.getParam('destinationLocation') ? this.props.navigation.getParam('destinationLocation') : '';
        this.parent = this.props.navigation.getParam('parent');
        this.state = {
            ...this.state,
            resultAutoFill : null
        };
        this.isTyping = '';
        this.placeLatLong = !Identify.isEmptyObject(this.props.place_location) ? this.props.place_location : this.props.currentLocation;
        this.destinationLatLong = this.props.destinationLocation;
        this.refInput = {}
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
    renderInput (inputKey,placeHolder,style={}) {
        return (
            <Item
                style={style}
            >
                <Input
                    clearTextOnFocus={true}
                    numberOfLines={1}
                    returnKeyType={'done'}
                    defaultValue={this[inputKey]}
                    placeholder={placeHolder}
                    style={{
                        fontSize: 13,
                        fontWeight: '500',
                        marginBottom: 15
                    }}
                    onChangeText={text => {
                        if(inputKey === 'currentLocation'){
                            this.props.storeData('isUserUseCurrentPosition', false);
                        }
                        this.isTyping = inputKey;
                        this[inputKey] = text;
                        this.requestAutoFill(text)
                    }}
                />
            </Item>
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
                    {this.renderInput('currentLocation','Nhập điểm đến')}
                    {this.renderInput('destinationLocation','Nhập điểm đi',{borderColor: 'transparent'})}
                </View>
            </View>
        )
    }
    requestAutoFill(text){
        let token = Identify.makeid();
        Connection.restData();
        Connection.setGetData({
            input: text,
            sessiontoken: token,
            types: 'address',
            radius : 5000,
            location: this.props.currentLocation.position.latitude + ',' + this.props.currentLocation.position.longitude
        });
        Connection.connect('place/queryautocomplete/json', this, 'GET', 'auto_fill')
    }
    requestGetLatLong(placeId){
        Connection.restData();
        Connection.setGetData({
            placeid: placeId
        });
        Connection.connect('place/details/json', this, 'GET', 'get_lat_long')
    }
    getDirection(){
        Connection.setGetData({
            origin: this.placeLatLong.position.latitude.toString() + ',' + this.placeLatLong.position.longitude.toString(),
            destination: this.destinationLatLong.position.latitude.toString() + ',' + this.destinationLatLong.position.longitude.toString(),
            mode: 'transit'
        });
        Connection.connect('directions/json', this, 'GET', 'get_direction')
    }
    setData(data, requestID) {
        switch (requestID){
            case 'auto_fill':
                this.setState({resultAutoFill : data.predictions});
                break;
            case 'get_lat_long':
                let dataToStore = {
                    position: {
                        latitude: data.result.geometry.location.lat,
                        longitude: data.result.geometry.location.lng
                    },
                    region : {
                        latitude: data.result.geometry.location.lat,
                        longitude: data.result.geometry.location.lng,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.001,
                    }
                };
                let key = '';
                if(this.isTyping === 'currentLocation'){
                    key = 'place_location';
                    this.placeLatLong = dataToStore;
                }else {
                    key = 'destination_location';
                    this.destinationLatLong = dataToStore;
                }
                this.props.storeData(key, dataToStore);
                if(this.currentLocation !== '' && this.destinationLocation !== ''){
                    this.getDirection();
                }
                break;
            case 'get_direction':
                if(data.routes.length > 0){
                    let polylineData = polyline.decode(data.routes[0].overview_polyline.points);
                    let listDirection = [];
                    polylineData.map(point => {
                        listDirection.push(
                            {
                                latitude: point[0],
                                longitude: point[1]
                            }
                        )
                    });

                    this.props.storeData('polyline', listDirection);
                    this.props.storeData('direction_data', data);
                    this.parent.setState({
                        currentLocation: this.currentLocation,
                        destinationLocation: this.destinationLocation
                    });
                    NavigationManager.backToPreviousPage(this.props.navigation);
                    setTimeout(
                        () => {
                            this.parent.fitToMarker()
                        },
                        500
                    )
                } else {
                    Toast.show({
                        text: 'Không thể tìm lộ trình với địa chỉ trên. Mời bạn nhập lại!!',
                        buttonText: 'OK',
                        buttonTextStyle: {color: Identify.mainColor, fontWeight: '900'},
                        duration: 3000
                    })
                }

                break;
            default:
                NavigationManager.backToPreviousPage(this.props.navigation)
        }
    }
    renderResultAutoFill(){
        if(this.state.resultAutoFill){
            let list = [];
            this.state.resultAutoFill.forEach(place => {
                let address = Identify.formatAddress(place.description);
                list.push(
                    <TouchableOpacity
                        onPress={() => {
                            this[this.isTyping] = place.description;
                            Keyboard.dismiss();
                            this.forceUpdate();
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
const mapStateToProps = (state) => {
    return {
        currentLocation: state.redux_data.current_location ,
        isUserUseCurrentPosition: state.redux_data.isUserUseCurrentPosition,
        place_location: state.redux_data.place_location,
        destinationLocation: state.redux_data.destination_location
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(InputAddress);