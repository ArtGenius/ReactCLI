import rootReducer from './state/rootState';
import {createReduxStore} from '${createReduxStoreRelativePath}';

export const createStore = () => {
    return createReduxStore(rootReducer);
};