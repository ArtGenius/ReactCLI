import {combineReducers} from 'redux';
import requestsReducer from '${requestsReducerRelativePth}';

const rootReducer = combineReducers({
    requests: requestsReducer,
});

export default rootReducer;

export const getRequestsSlice = (state) => state.requests;