const initialState = {
    current_location : null
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
    switch (action.type) {
        case 'current_location':
            return { ...state, ...{ 'current_location': action.data } };
        default:
            let customData = {};
            customData[action.type] = action.data;
            return { ...state, ...customData };
    }
}