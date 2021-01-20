import { combineReducers } from 'redux-immutable'
import cartReducer from './cartReducer';

const allReducers = {
    cartReducer: cartReducer
};

const rootReducer = combineReducers(allReducers);

export default rootReducer;