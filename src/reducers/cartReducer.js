import {ADD_TO_CART} from '../action/cartActions';

export default (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            console.log(action.payload);
            return [
                ...state.push(action.payload)
            ]
        }
        default:
            return state;
    }
}