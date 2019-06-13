import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import {scale, verticalScale} from "react-native-size-matters";
import NavigationManager from "../helper/NavigationManager";

export default class ThumbAction extends React.Component{
    constructor(props){
        super(props)
    }
    handleThumb(){
        if(this.props.navigation.state.routeName === 'Home'){
            this.props.navigation.openDrawer();
        }else {
            NavigationManager.backToPreviousPage(this.props.navigation)
        }
    }
    render(){
        return (
            <TouchableOpacity
                onPress={() => {this.handleThumb()}}
                activeOpacity={0.8}
                style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Icon style={{color: "#20bf6b", fontSize: 28}} name={this.props.navigation.state.routeName === 'Home' ? 'menu' : 'ios-arrow-back' }/>
            </TouchableOpacity>
        )
    }
}