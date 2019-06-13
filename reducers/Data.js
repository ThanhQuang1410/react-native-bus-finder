const initialState = {
    isUserUseCurrentPosition: true,
    showTraffic: false,
    current_location: {},
    place_location: {},
    destination_location: {},
    location_map: {},
    polyline: null,
    direction_data: null,
    app_config: null,
    customer_data: null
}
export function redux_data(state = initialState, action) {
    if (action.type === 'actions') {
        let actions = action.data;
        actions.forEach(item => {
            state = processSingleAction(state, item);
        });
        return state;
    } else {
        return processSingleAction(state, action);
    }
}
function processSingleAction(state, action) {
    let location_map = state.location_map;
    switch (action.type) {
        case 'current_location':
            location_map['current_location'] = action.data;
            return { ...state, ...{ 'current_location': action.data }, location_map };
        case 'isUserUseCurrentPosition':
            return { ...state, ...{ 'isUserUseCurrentPosition': action.data } };
        case 'place_location':
            location_map['place_location'] = action.data;
            return { ...state, ...{ 'place_location': action.data }, location_map };
        case 'destination_location':
            location_map['destination_location'] = action.data;
            return { ...state, ...{ 'destination_location': action.data }, location_map };
        case 'polyline':
            return {...state, ...{ 'polyline': action.data } };
        case 'direction_data':
            return {...state, ...{ 'direction_data': action.data } };
        case 'app_config':
            return {...state, ...{ 'app_config': action.data } };
        case 'customer_data':
            return {...state, ...{ 'customer_data': action.data } };
        case 'showTraffic':
            return { ...state, ...{ 'showTraffic': action.data } };
        default:
            let customData = {};
            customData[action.type] = action.data;
            return { ...state, ...customData };
    }
}