import React from 'react'
import MapView from 'react-native-maps';
import { Image , Platform } from 'react-native'

export default class MarkerComponent extends React.Component{
    addPropsTomarker(){
        if(Platform.OS === 'ios'){
            return {
                centerOffset : {
                    x: 0,
                    y: -30
                }
            }
        }
    }
    render(){
        return(
            <MapView.Marker
                coordinate={this.props.position}
                {...this.addPropsTomarker()}
            >
                <Image
                    source={this.props.imageSource}
                    style={{
                        width: 29,
                        height: 45,
                    }}
                />
            </MapView.Marker>
        )
    }
}