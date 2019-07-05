import React from 'react'
import {Text, View , Icon , Fab , Toast } from "native-base";
import {Dimensions, Image, TouchableOpacity , FlatList } from "react-native";
import Identify from "../../../helper/Identify";
import {scale, verticalScale } from "react-native-size-matters";
import md5 from 'md5'
import firebase from 'firebase'
export default class FabSection extends React.Component {
    constructor(props) {
        super(props);
        this.state  = {
            active: false
        };
        this.parent = this.props.parent
    }

    componentWillUnmount() {
        this.setState({
            active: false
        })
    }

    renderFabCurrent(){
        return (
            <TouchableOpacity
                onPress={() => {
                    this.parent.getCurrentLocation();
                    this.setState({
                        active: false
                    })
                }}
                activeOpacity={0.8}
                style={{
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 5,
                    width: 45,
                    height: 45,
                    borderRadius: 45/2
                }}
            >
                <Image resizeMode={'contain'} style={{width: 25, height: 25}} source={require('../../../../media/Images/marker_cur.png')}/>
            </TouchableOpacity>
        )
    }
    handleAddToFavorite() {
        let params = {
            polyline: this.parent.props.polyline,
            currentLocation: this.parent.state.currentLocation,
            destinationLocation: this.parent.state.destinationLocation,
            direction_data: this.parent.props.direction_data,
            location_map: this.parent.props.location_map
        };
        if(this.parent.props.isUserUseCurrentPosition){
            params.location_map['place_location'] = this.parent.props.current_location
        }
        let key = md5(new Date());
        firebase.database().ref('/users/' + this.parent.props.customer_data.uid + '/favorite_route/' + key).set(params).then(() => {
            Toast.show({
                text: 'Bạn đã lưu lộ trình thành công',
                buttonText: 'OK',
                buttonTextStyle: {fontWeight: '900', color: Identify.mainColor} ,
                duration: 3000
            })
        });
    }
    renderFavoriteFab(){
        return (
            <TouchableOpacity
                onPress={() => {
                    if(!this.parent.props.polyline) {
                        Toast.show({
                            text: 'Bạn chưa có lộ trình nào khả dụng',
                            buttonText: 'OK',
                            buttonTextStyle: {fontWeight: '900', color: Identify.mainColor} ,
                            duration: 3000
                        })
                    } else {
                        this.handleAddToFavorite()
                    }
                }}
                activeOpacity={0.8}
                style={{
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 15,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 5,
                    width: 45,
                    height: 45,
                    borderRadius: 45/2
                }}
            >
                <Icon type='MaterialCommunityIcons' name={'heart'} style={{color: Identify.mainColor}}/>
            </TouchableOpacity>
        )
    }

    render () {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: !this.parent.props.direction_data ? verticalScale(160) : verticalScale(270),
                    right: 15,
                    zIndex: 9999,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {this.state.active && !this.parent.selectFavorite && this.renderFavoriteFab()}
                {this.state.active && this.renderFabCurrent()}
                <TouchableOpacity
                    style={{
                        backgroundColor: Identify.mainColor,
                        width: 55, height: 55,
                        borderRadius: 55/2,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={() => {
                        this.setState(oldState => {
                            return {
                                active: !oldState.active
                            }
                        })
                    }}>
                    <Icon style={{color: 'white'}} type='MaterialCommunityIcons' name="bus" />
                </TouchableOpacity>
            </View>
        )
    }
}