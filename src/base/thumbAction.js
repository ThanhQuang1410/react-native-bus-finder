import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import {scale, verticalScale} from "react-native-size-matters";

export default class ThumbAction extends React.Component{
    constructor(props){
        super(props)
    }
    handleThumb(){
        this.props.navigation.openDrawer();
    }
    render(){
        return (
            <TouchableOpacity
                onPress={() => {this.handleThumb()}}
                activeOpacity={0.8}
                style={{
                    width: 45,
                    height: 45,
                    borderRadius: 35,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5,
                    position: 'absolute',
                    top: verticalScale(35),
                    left: 13,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Icon style={{color: "#646464", fontSize: 20}} name={'menu'}/>
            </TouchableOpacity>
        )
    }
}