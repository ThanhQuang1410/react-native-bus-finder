import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import {Container , Fab , Icon} from 'native-base'
import {Platform,Image , TouchableOpacity} from 'react-native'
import {connect} from "react-redux";
import MapView, {PROVIDER_GOOGLE } from 'react-native-maps';
import markerIcon from '../../../../media/Images/marker.png'
import busMarker from '../../../../media/Images/bus.png';
import AddressSection from "../components/addressSections";
import {scale, verticalScale} from "react-native-size-matters";
import Connection from "../../../helper/Connection";
import MarkerComponent from "../components/marker";

class Home extends AbstractComponent{
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: null,
            destinationLocation: null,
        };
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
        this.props.storeData('current_location', data);
    }
    fitToMarker(){
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
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
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
        let listMarker = [];
        Object.keys(this.props.location_map).forEach(keys => {
            let marker = this.props.location_map[keys];
            let imgSource = busMarker;
            if(keys === 'current_location'){
                imgSource = markerIcon
            }
            if(marker.position.latitude && marker.position.longitude){
                listMarker.push(<MarkerComponent key={keys} position={marker.position} imageSource={imgSource}/>)
            }
        });
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
                    region={this.props.current_location.region}
                >
                    {listMarker}
                </MapView.Animated>
                <AddressSection navigation={this.props.navigation} parent={this}/>
                {this.renderFabCurrent()}
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        location_map: state.redux_data.location_map ,
        current_location: state.redux_data.current_location ,
        place_location: state.redux_data.place_location ,
        destination_location: state.redux_data.destination_location ,
        isUserUseCurrentPosition: state.redux_data.isUserUseCurrentPosition
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Home);