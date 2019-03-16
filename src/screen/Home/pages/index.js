import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import {Container , Fab , Icon} from 'native-base'
import {Platform,Image , TouchableOpacity} from 'react-native'
import {connect} from "react-redux";
import MapView, {PROVIDER_GOOGLE } from 'react-native-maps';
import markerIcon from '../../../../media/Images/marker.png'
import AddressSection from "../components/addressSections";
import {scale, verticalScale} from "react-native-size-matters";
import Connection from "../../../helper/Connection";
import MarkerComponent from "../components/marker";

class Home extends AbstractComponent{
    constructor(props) {
        super(props);
        this.state = {
            userPosition: undefined,
            userRegion: undefined,
            currentLocation: null,
            destinationLocation: null,
            destinationPositionLatLong: undefined,
            currentPositionLatLong: undefined,
        }
        this.mapRef = null;
    }

    componentDidMount(){
        this.getCurrentLocation()
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const { latitude, longitude } = coords;

                this.handleLocation(coords)
                console.log(latitude, longitude)
                Connection.setGetData({
                    latlng: latitude.toString() + ',' + longitude.toString()
                })
                Connection.connect('geocode/json', this)
            },
            (error) => console.log(error),
            { enableHighAccuracy: false, timeout: 3600000, maximumAge: 10000 }
        )
    }

    setData(data){
        this.setState({
            currentLocation : data.results[0].formatted_address
        })
    }
    handleLocation(coords){
        const { latitude, longitude } = coords;
        this.setState({
            userPosition: {
                latitude,
                longitude,
            },
            userRegion: {
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.001,
            }
        })
    }
    fitToMarker(){
        // this.mapRef._component.fitToCoordinates(
        //     [
        //         {...this.state.destinationPositionLatLong},
        //         {...this.state.currentPositionLatLong}
        //     ],
        //     { animated: true }
        // );
        this.mapRef.getNode().fitToElements(true);
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
                    shadowOpacity: 0.4,
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
                    ref={(ref) => { this.mapRef = ref }}
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    followUserLocation={true}
                    showsMyLocationButton={false}
                    region={this.state.userRegion}
                >
                    {this.state.userPosition && <MarkerComponent position={this.state.userPosition} imageSource={markerIcon}/>}
                    {this.state.currentPositionLatLong && <MarkerComponent position={this.state.currentPositionLatLong} imageSource={markerIcon}/>}
                    {this.state.destinationPositionLatLong && <MarkerComponent position={this.state.destinationPositionLatLong} imageSource={markerIcon}/>}
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