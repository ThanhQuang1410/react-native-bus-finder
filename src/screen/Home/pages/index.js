import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import {Container , Fab , Icon} from 'native-base'
import {Platform,Image , TouchableOpacity} from 'react-native'
import {connect} from "react-redux";
import MapView, {PROVIDER_GOOGLE } from 'react-native-maps';
import markerIcon from '../../../../media/Images/marker.png'
import AddressSection from "../components/addressSections";
import {scale, verticalScale} from "react-native-size-matters";
import RNRestart from "react-native-restart";

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

    getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const { latitude, longitude } = coords;
                let data = {
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
                }
                this.map.animateToRegion(data.position, 3000)
                this.props.storeData('current_location', data)
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    }

    renderFabCurrent(){
        return (
            <TouchableOpacity
                onPress={() => {
                    this.getCurrentLocation()
                }}
                activeOpacity={0.8}
                style={{
                    width: 55,
                    height: 55,
                    position: 'absolute',
                    right: 25,
                    bottom: verticalScale(170),
                    backgroundColor: 'white',
                    borderRadius: 55/2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Image resizeMode={'contain'} style={{width: 35, height: 35}} source={require('../../../../media/Images/marker_cur.png')}/>
            </TouchableOpacity>
        )
    }

    createLayout(){
        return(
            <Container>
                <MapView.Animated
                    ref={ref => this.map = ref}
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    followUserLocation={true}
                    showsMyLocationButton={false}
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
                <AddressSection navigation={this.props.navigation} parent={this}/>
                {this.renderFabCurrent()}
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.current_location };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Home);