import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import {Text , Container, Fab , Icon } from 'native-base'
import {Platform,Image} from 'react-native'
import {connect} from "react-redux";
import MapView, { Marker , PROVIDER_GOOGLE } from 'react-native-maps';
import markerIcon from '../../../../media/Images/marker.png'
class Home extends AbstractComponent{
    constructor(props) {
        super(props);
        this.state = {
            position: undefined,
            region: undefined
        }
    }

    componentDidMount(){
        this.setState({
            position: this.props.data.position,
            region: this.props.data.region
        })
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
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

    createLayout(){
        return(
            <Container>
                <MapView.Animated
                    // provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    followUserLocation={true}
                    showsMyLocationButton={true}
                    region={this.state.region}
                >
                    {this.state.position && <MapView.Marker
                        coordinate={this.state.position}
                        image={Platform.OS === 'android' ? markerIcon : undefined}
                        {...this.addPropsTomarker()}
                    >
                        {Platform.OS === 'ios'
                            ? <Image
                                source={markerIcon}
                                style={{
                                    width: 40,
                                    height: 63,
                                }}
                            />
                            : null}
                    </MapView.Marker>}
                </MapView.Animated>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.current_location };
}
// export default Splash;
export default connect(mapStateToProps)(Home);