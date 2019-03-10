import React from 'react';
import { Dimensions, View } from 'react-native';
import ThumbAction from "./thumbAction";

export default class AbstractComponent extends React.Component {
    createLayout() {
        return null
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.createLayout()}
                <ThumbAction navigation={this.props.navigation}/>
            </View>
        );
    }
}