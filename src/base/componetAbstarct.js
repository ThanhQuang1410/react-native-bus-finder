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
                    style={{
                        top: 0,
                        position: 'absolute',
                        paddingBottom: 10,
                        backgroundColor: "transparent",
                        elevation:0,
                        zIndex: 10000
                    }}
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