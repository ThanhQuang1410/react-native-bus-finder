import React from 'react';
import { Dimensions } from 'react-native';
import { Container , Header , Left , View , Right , Body} from 'native-base'
import ThumbAction from "./thumbAction";

export default class AbstractComponent extends React.Component {
    createLayout() {
        return null
    }
    render() {
        return (
            <Container >
                <Header
                    iosBarStyle={"light-content"}
                    androidStatusBarColor="rgba(0,0,0,0.251)"
                    transparent
                    noShadow
                >
                    <Left>
                        <ThumbAction navigation={this.props.navigation}/>
                    </Left>
                    <Body/>
                    <Right/>
                </Header>
                <View style={{ flex: 1 , zIndex: -1}}>
                    {this.createLayout()}
                </View>
            </Container>
        );
    }
}