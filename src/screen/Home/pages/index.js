import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import {Text , Container, Fab , Icon} from 'native-base'
import {connect} from "react-redux";
import MapView, { Marker , GoogleMap } from 'react-native-maps';
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

    createLayout(){
        return(
            <Container>
                <MapView.Animated
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
                        image={markerIcon}
                    />}
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