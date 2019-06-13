import React from 'react'
import {Container, List , Text , View } from 'native-base'
import {Image} from 'react-native'
import {connect} from 'react-redux'
import Item from './item'
import Identify from "../../helper/Identify";

class Drawer extends React.Component{
    initData(){
        let items = [
            {
                icon_name: 'heart-outline',
                title: 'Lộ trình ưa thích',
                route: 'FavoriteRoute'
            }
        ];
        if(this.props.data){
            this.props.data.forEach(item => {
                item['webView'] = 'WebView';
                items.push(item)
            })
        }
        items = [...items, {icon_name: 'logout' , title: 'Đăng xuất' , route: 'LogOut'}];
        return items
    }
    renderUser = () => {
        let user = this.props.customer_data;
        let avt = <Image resizeMode={'contain'} style={{ width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }} source={require('../../../media/Images/bus.png')}/>;
        let name = <Text>{user.email}</Text>;
        if(user.photoURL) {
            avt = <Image resizeMode={'contain'} style={{ width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }} source={{uri: user.photoURL}}/>
        }
        if(user.displayName) {
            name = <Text>{user.displayName}</Text>
        }
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 15,
                    marginTop: 20,
                    borderRadius: 25, overflow: 'hidden'
                }}
            >
                {avt}
                {name}
            </View>
        )
    };
    render() {
        let items = this.initData();
        return (
            <Container style={{ backgroundColor: 'white', paddingTop: 30 }}>
                {this.props.customer_data && this.renderUser()}
                <List
                    dataArray={items}
                    renderRow={data => {
                        return (
                            <Item data={data} navigation={this.props.navigation}/>
                        );
                    }}
                />
            </Container>
        )
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data.app_config, customer_data: state.redux_data.customer_data };
};
export default connect(mapStateToProps , null )(Drawer);