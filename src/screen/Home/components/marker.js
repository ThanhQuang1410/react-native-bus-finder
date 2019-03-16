import React from 'react'
import MapView from 'react-native-maps';
import { Image , Platform } from 'react-native'

export default class MarkerComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            position: this.props.position
        }
    }
    addPropsTomarker(){
        if(Platform.OS === 'ios'){
            return {
                centerOffset : {
                    x: 0,
                    y: -35
                }
            }
        }
    }
    render(){
        return(
            <MapView.Marker
                coordinate={this.state.position}
                {...this.addPropsTomarker()}
            >
                <Image
                    source={this.props.imageSource}
                    style={{
                        width: 40,
                        height: 63,
                    }}
                />
            </MapView.Marker>
        )
    }
}