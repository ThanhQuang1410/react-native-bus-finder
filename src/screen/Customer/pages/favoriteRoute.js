import React from 'react'
import AbstractComponent from "../../../base/componetAbstarct";
import {Text, View , Icon , Fab , Toast , Card , Container , Content } from "native-base";
import { TouchableOpacity , Image} from 'react-native'
import {connect} from 'react-redux'
import firebase from 'firebase'
import Identify from "../../../helper/Identify";
import NavigationManager from "../../../helper/NavigationManager";
class FavoriteRoute extends AbstractComponent{
    constructor(props) {
        super(props)
        this.state = {
            showLoading: 'full',
            favoriteRoute: null
        };
    }
    componentDidMount() {
        firebase.database().ref('/users/' + this.props.customer_data.uid + '/favorite_route/').once('value').then(function(snapshot) {
            this.showLoading();
            let data = snapshot.val();
            let favoriteRoute = [];
            for(let key in data) {
                favoriteRoute.push(data[key])
            }
            this.setState({
                favoriteRoute: favoriteRoute
            })
        }.bind(this));
    }
    handleItemSelected(item) {
        let isUserUseCurrentPosition = false;
        if(JSON.stringify(item.location_map.current_location) === JSON.stringify(this.props.current_location)) {
            isUserUseCurrentPosition = true
        }
        this.props.storeData('actions',[
            {type: 'isUserUseCurrentPosition', data: isUserUseCurrentPosition},
            {type: 'destination_location', data: item.location_map.destination_location},
            {type: 'place_location', data: item.location_map.place_location},
            {type: 'polyline', data: item.polyline},
            {type: 'direction_data', data: item.direction_data},
        ]);
        NavigationManager.openPage(this.props.navigation, 'Home', {destinationLocation: item.destinationLocation, currentLocation: item.currentLocation , selectFavorite: true})
    }
    createLayout() {
        if(this.state.favoriteRoute) {
            let list = []
            this.state.favoriteRoute.forEach(item => {
                list.push(
                    <TouchableOpacity
                        onPress={() => {
                            this.handleItemSelected(item)
                        }}
                        key={Identify.makeid()}>
                        <Card
                            style={{
                                padding: 7
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Image style={{width: 25, height: 25}} source={require('../../../../media/Images/current.png')}/>
                                <View
                                    style={{
                                        flexGrow: 1,
                                        width: '80%',
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: '#c3c3c3',
                                        marginLeft: 10,
                                        paddingBottom: 10,

                                    }}
                                >
                                    <Text>
                                        {item.currentLocation}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 10
                                }}
                            >
                                <Image style={{width: 25, height: 30}} source={require('../../../../media/Images/destination.png')}/>
                                <Text style={{flexGrow: 1, width: '80%', marginLeft: 10}}>{item.destinationLocation}</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>

                )
            });
            return (
                <Container>
                    <Content style={{marginLeft: 12, marginRight: 12}}>
                        {list}
                    </Content>
                </Container>
            )
        } else return null
    }
}
const mapStateToProps = (state) => {
    return {
        customer_data: state.redux_data.customer_data,
        current_location: state.redux_data.current_location,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(FavoriteRoute);