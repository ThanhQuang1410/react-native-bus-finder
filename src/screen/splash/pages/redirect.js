import React from 'react';
import NavigationManager from "../../../helper/NavigationManager";


export default class Redirect extends React.Component{
    componentDidMount(){
        NavigationManager.openRootPage(this.props.navigation, 'Home')
    }
    render(){
        return null
    }
}