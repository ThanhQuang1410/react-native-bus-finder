import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import { Container , Text , Content , View , Input , Item} from 'native-base'
import { Image , TouchableOpacity } from 'react-native';
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
        this.parent = this.props.navigation.getParam('parent')
        this.state = {
            currentLocation: this.currentLocation,
            destinationLocation: this.destinationLocation,
            isInputPlace: false,
            isInputDestination: false,
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
                                this.props.storeData('isUserUseCurrentPosition', false);
                                this.state.currentLocation = text;
                                this.setState({
                                    isInputPlace: true,
                                    isInputDestination: false
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
                            onFocus= {() => this.setState({destinationLocation : ''})}
                            numberOfLines={1}
                            returnKeyType={'done'}
                            style={{
                                marginTop: 15,
                                fontSize: 13,
                                fontWeight: '500'
                            }}
                            defaultValue={this.state.destinationLocation}
                            value={this.state.destinationLocation}
                            placeholder={'Nhập điểm đến'}
                            onChangeText={text => {
                                this.state.destinationLocation = text
                                this.setState({
                                    isInputPlace: false,
                                    isInputDestination: true
                                });
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
            location: this.props.current_location.position.latitude + ',' + this.props.current_location.position.longitude
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
        }else if(data.hasOwnProperty('geocoded_waypoints')){
            this.props.storeData('direction_data', data);
            let polylineDirection = polyline.decode(data.routes[0].overview_polyline.points);
            let listDirection = [];
            polylineDirection.map(point => {
                listDirection.push(
                    {
                        latitude: point[0],
                        longitude: point[1]
                    }
                )
            });
            this.props.storeData('polyline', listDirection);
            this.parent.setState({
                currentLocation: this.state.currentLocation,
                destinationLocation: this.state.destinationLocation
            });
            NavigationManager.backToPreviousPage(this.props.navigation);
            setTimeout(() => {
                this.parent.fitToMarker()
            }, 500)
        }else {
            let latitude = data.result.geometry.location.lat;
            let longitude = data.result.geometry.location.lng;
            let dataToStore = {
                position: {
                    latitude,
                    longitude,
                },
                region: {
                    latitude,
                    longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.001,
                }
            };
            if(this.state.isInputDestination){
                this.props.storeData('destination_location', dataToStore)
            }
            if(this.state.isInputPlace){
                this.props.storeData('place_location', dataToStore)
            }
            if(this.state.currentLocation !== '' && this.state.destinationLocation !== ''){
                this.getDirection();
            }
        }
    }
    getDirection(){
        Connection.setGetData({
            origin: this.props.current_location.position.latitude.toString() + ',' + this.props.current_location.position.longitude.toString(),
            destination: this.props.destination_location.position.latitude.toString() + ',' + this.props.destination_location.position.longitude.toString(),
            mode: 'transit'
        });
        Connection.connect('directions/json', this)
    }
    renderResultAutoFill(){
        if(this.state.resultAutoFill){
            let list = [];
            this.state.resultAutoFill.forEach(place => {
                let address = Identify.formatAddress(place.description);
                list.push(
                    <TouchableOpacity
                        onPress={() => {
                            let key = 'currentLocation';
                            if(this.state.isInputDestination){
                                key = 'destinationLocation'
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
const mapStateToProps = (state) => {
    return {
        current_location: state.redux_data.current_location ,
        isUserUseCurrentPosition: state.redux_data.isUserUseCurrentPosition,
        place_location: state.redux_data.place_location,
        destination_location: state.redux_data.destination_location
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