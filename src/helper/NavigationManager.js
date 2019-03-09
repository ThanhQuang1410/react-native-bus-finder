import { StackActions, NavigationActions } from 'react-navigation';

export default class NavigationManager {

    static savedNavigation;

    static openRootPage(navigation, routeName, params = {}) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: routeName,
                params: {...params,previousRoute : (navigation && navigation !== null) ? navigation.state.routeName : null}
            })],
        });
        if(navigation == null) {
            navigation = this.savedNavigation
        }
        navigation.dispatch(resetAction);
    }

    static openPage(navigation, routeName, params = {}) {
        const pushAction = StackActions.push({
            routeName: routeName,
            params: {...params,previousRoute : (navigation && navigation !== null) ? navigation.state.routeName : null}
        });
        if(navigation == null) {
            navigation = this.savedNavigation
        }
        navigation.dispatch(pushAction);
    }

    static backToPreviousPage(navigation) {
        const popAction = StackActions.pop({
            n: 1,
        });
        if(navigation == null) {
            navigation = this.savedNavigation
        }
        navigation.dispatch(popAction);
    }

    static backToPage(navigation, step = 1) {
        const popAction = StackActions.pop({
            n: step,
        });
        if(navigation == null) {
            navigation = this.savedNavigation
        }
        navigation.dispatch(popAction);
    }

    static backToRootPage(navigation) {
        if(navigation == null) {
            navigation = this.savedNavigation
        }
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: 'Home'
            })],
        });
        navigation.dispatch(resetAction);
    }

    static saveNavigation(navigation) {
        this.savedNavigation = navigation;
    }

}