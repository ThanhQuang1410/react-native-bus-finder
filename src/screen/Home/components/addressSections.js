import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import {scale, verticalScale } from "react-native-size-matters";
import {Text, View , Icon , Fab } from "native-base";
import {Dimensions, Image, TouchableOpacity , FlatList } from "react-native";
import NavigationManager from "../../../helper/NavigationManager";
import Identify from "../../../helper/Identify";

export default class AddressSection extends React.Component{
    constructor(props) {
        super(props);
        this.state  = {
            active: false
        };
        this.deviceWidth = Dimensions.get('window').width
        this.destination = this.props.navigation.getParam('destination')
        this.parent = this.props.parent
    }
    handleSectionPress(){
        let params = {
            parent : this.props.parent
        };
        if(this.parent.state.currentLocation !== null){
            params['currentLocation'] = this.parent.state.currentLocation
        }
        if(this.parent.state.destinationLocation !== null){
            params['destinationLocation'] = this.parent.state.destinationLocation
        }
        NavigationManager.openPage(this.props.navigation, 'InputAddress', params)
    }
    renderWalking(item){
        return (
            <TouchableOpacity
                style={{
                    borderRadius: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    maxWidth: Dimensions.get('window').width * 2 / 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 7,
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: 'white',
                    padding: 10,
                    marginBottom: 15,
                    marginTop: 15
                }}
            >
                <Image resizeMode={'contain'} style={{width: 20, height: 40}} source={require('../../../../media/Images/walk.png')}/>
                <View style={{flexGrow: 1}}>
                    <Text style={{color: 'black', fontSize: 13, fontWeight: '600', marginRight: 20}}>{item.html_instructions.replace('Walk to', 'Đi bộ tới')}</Text>
                    <Text style={{color: '#b2b2b2', fontSize: 11, marginRight: 20}}>{item.distance.text} - {item.duration.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    renderTransit = (item) => {
        return (
            <TouchableOpacity
                style={{
                    borderRadius: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    maxWidth: Dimensions.get('window').width * 2 / 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 7,
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: 'white',
                    padding: 10,
                    marginBottom: 15,
                    marginTop: 15
                }}
            >
                <Image resizeMode={'contain'} style={{width: 20, height: 40}} source={require('../../../../media/Images/bus_mini.png')}/>
                <View style={{flexGrow: 1}}>
                    <Text style={{color: 'black', fontSize: 13, fontWeight: '600', marginRight: 20}}>{item.transit_details.line.name}</Text>
                    <Text style={{color: '#b2b2b2', fontSize: 11, marginRight: 20}}>{item.transit_details.departure_stop.name} - {item.transit_details.arrival_stop.name}</Text>
                    <Text style={{color: '#b2b2b2', fontSize: 11, marginRight: 20}}>{item.duration.text} ({item.transit_details.num_stops} điểm )</Text>
                </View>
            </TouchableOpacity>
        )
    }
    renderItem(item){
        switch (item.travel_mode){
            case 'WALKING':
                return this.renderWalking(item);
            case 'TRANSIT':
                return this.renderTransit(item);
            default:
                return null
        }
    }
    renderDirectionInstruction(){
        if(this.parent.props.direction_data){
            return (
                <FlatList
                    style={{
                        paddingLeft: 12, paddingRight: 12,
                    }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={this.parent.props.direction_data.routes[0].legs[0].steps}
                    keyExtractor={() => Identify.makeid()}
                    renderItem={({ item }) => this.renderItem(item)}
                />
            )
        }
        return null;
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
                        marginBottom: !this.parent.props.direction_data ? verticalScale(165) : verticalScale(270),
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 5,
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            right: 60,
                            padding: 5,
                            borderRadius: 10,
                            backgroundColor: '#ffffffcf'
                        }}
                    >
                        <Text>Hiển thị vị trí hiện tại của bạn</Text>
                    </View>
                    <Image resizeMode={'contain'} style={{width: 25, height: 25}} source={require('../../../../media/Images/marker_cur.png')}/>
                </TouchableOpacity>
        )
    }
    renderFavoriteFab(){
        return (
            <TouchableOpacity
                onPress={() => {
                    console.log({
                        polyline: this.parent.props.polyline,
                        currentLocation: this.parent.currentLocation,
                        destinationLocation: this.parent.destinationLocation
                    });
                    this.setState({
                        active: false
                    })
                }}
                activeOpacity={0.8}
                style={{
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: !this.parent.props.direction_data ? verticalScale(165) : verticalScale(270),
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 5,
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        right: 60,
                        padding: 5,
                        borderRadius: 10,
                        backgroundColor: '#ffffffcf'
                    }}
                >
                    <Text>Thêm vào tuyến ưa thích của bạn</Text>
                </View>
                <Icon type='MaterialCommunityIcons' name={'heart'} style={{color: Identify.mainColor}}/>
            </TouchableOpacity>
        )
    }
    renderFab(){
        return (
            <Fab
                active={this.state.active}
                direction="up"
                position="bottomRight"
                style={{ backgroundColor: Identify.mainColor, marginBottom: !this.parent.props.direction_data ? verticalScale(160) : verticalScale(270) , width: 45, height: 45}}
                onPress={() => this.setState(oldState => {
                    return {
                        active: !oldState.active
                    }
                })}>
                <Icon type='MaterialCommunityIcons' name="bus" />
                {this.renderFabCurrent()}
                {this.renderFavoriteFab()}
            </Fab>
        )
    }
    render(){
        return(
            <View
                style={{
                    flexDirection: 'column',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: 'white',
                    padding: 15
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.handleSectionPress()
                    }}
                    activeOpacity={0.92}
                    style={{
                        height: verticalScale(120),
                        flexDirection: 'row'
                    }}
                >
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
                                justifyContent: 'center',
                                paddingRight: 15
                            }}>
                            <Text numberOfLines={1} style={this.parent.state.currentLocation ? {fontSize: 13} : {fontWeight: '500',color: '#d8d8d8', fontSize: 18}}>
                                {this.parent.state.currentLocation !== null ? Identify.formatAddress(this.parent.state.currentLocation).mainAddress :   'Bạn đang ở đây'}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexGrow: 1,
                                width: '100%',
                                justifyContent: 'center',
                                paddingRight: 15
                            }}>
                            <Text numberOfLines={1} style={this.parent.state.destinationLocation ? {fontSize: 13} : {fontWeight: '500',color: '#d8d8d8', fontSize: 18}}>
                                {this.parent.state.destinationLocation !== null ? Identify.formatAddress(this.parent.state.destinationLocation).mainAddress : 'Nhập điểm đến'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {this.renderFab()}
                {this.renderDirectionInstruction()}
            </View>
        )
    }
}