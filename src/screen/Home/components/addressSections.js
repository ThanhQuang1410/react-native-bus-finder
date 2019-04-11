import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import {scale, verticalScale} from "react-native-size-matters";
import {Text, View} from "native-base";
import {Dimensions, Image, TouchableOpacity} from "react-native";
import NavigationManager from "../../../helper/NavigationManager";
import Identify from "../../../helper/Identify";

export default class AddressSection extends React.Component{
    constructor(props) {
        super(props);
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
    render(){
        return(
            <TouchableOpacity
                onPress={() => {
                    this.handleSectionPress()
                }}
                activeOpacity={0.92}
                style={{
                    height: verticalScale(150),
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    padding: 15
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
        )
    }
}