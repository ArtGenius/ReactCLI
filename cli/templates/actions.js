import {makeTrackApiRequestActionCreator} from '${trackApiRequestRelativePath}';
import * as rootState from '../state/rootState';

const trackApiRequest = makeTrackApiRequestActionCreator(rootState.getRequestsSlice);