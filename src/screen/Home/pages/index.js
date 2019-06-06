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
            ...this.state,
            currentLocation: null,
            destinationLocation: null
        };
        this.customerData = this.props.navigation.getParam('customerData');
        this.mapRef = null;
    }

    componentDidMount(){
        this.props.storeData('customer_data', this.customerData);
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
                    mapPadding={{bottom: verticalScale(100), left: 20, right: 20}}
                    // showsTraffic={true}
                    region={this.props.current_location.region}
                >
                    {listMarker}
                    {this.props.polyline && <MapView.Polyline coordinates={this.props.polyline} strokeWidth={3} strokeColor={'#20bf6b'}/>}
                </MapView.Animated>
                <AddressSection navigation={this.props.navigation} parent={this}/>
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
        isUserUseCurrentPosition: state.redux_data.isUserUseCurrentPosition,
        polyline: state.redux_data.polyline,
        direction_data: state.redux_data.direction_data
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