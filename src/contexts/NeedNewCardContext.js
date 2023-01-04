import createDataContext from './createDataContext';

const reducer = (state, action) => {
    switch( action.type ) {
        case 'toggle':
            return !state;
        default:
            return state;
    }
}

const toggleState = dispatch => () => {
    dispatch({type: 'toggle'});
}

export const { Context, Provider } =
    createDataContext(
        reducer,
        { toggleState },
        false
    );