import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import {scale, verticalScale} from "react-native-size-matters";

export default class ThumbAction extends React.Component{
    constructor(props){
        super(props)
    }
    handleThumb(){
        if(this.props.navigation.state.routeName === 'Home'){
            this.props.navigation.openDrawer();
        }else {
            this.props.navigation.goBack(null)
        }
    }
    render(){
        return (
            <TouchableOpacity
                onPress={() => {this.handleThumb()}}
                activeOpacity={0.8}
                style={{
                    marginLeft: 25,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Icon style={{color: "#646464", fontSize: 28}} name={this.props.navigation.state.routeName === 'Home' ? 'menu' : 'ios-arrow-back' }/>
            </TouchableOpacity>
        )
    }
}