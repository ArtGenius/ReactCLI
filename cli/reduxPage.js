const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const args = minimist(process.argv);

const srcPath = [__dirname, '..', 'src'];
const arrPath = args.path.split('/');
const exportTOFragments = args.export;
const pageDirs = [
	[...arrPath, 'redux'],
	[...arrPath, 'Components'],
	[...arrPath, 'connect'],
	[...arrPath, 'redux', 'state'],
	[...arrPath, 'redux', 'actions'],
];

const componentName = arrPath[arrPath.length - 1];

// create Component dir structure
const currentArray = [];
arrPath.forEach(element => {
  currentArray.push(element);
  const currentResolvePath = path.resolve(...srcPath, ...currentArray);
  if (!fs.existsSync(currentResolvePath)) {
    fs.mkdirSync(currentResolvePath);
  }
});

pageDirs.forEach(dir => {
	fs.mkdirSync(path.resolve(...srcPath, ...dir));
});

const componentPath = [...srcPath, ...pageDirs[1]];

// create Component template
const componentCode = `import React from 'react';
import {Provider as ReduxStateProvider} from 'react-redux';

export default class ${componentName}Container extends React.Component {

    componentDidMount() {
        
    }

    render() {
        return (
            <ReduxStateProvider store={this.props.store}>
                <h1>${componentName}</h1>
            </ReduxStateProvider>
        )
    }
}`;
fs.writeFileSync(path.resolve(...componentPath, `${componentName}Container.jsx`), componentCode);

// create actions actions
const actionsPath = [...srcPath, ...pageDirs[4]];
let trackApiRequestRelativePath = '../../../redux/action/makeTrackApiRequestActionCreator';//relative to routes
arrPath.forEach(i => trackApiRequestRelativePath = '../' + trackApiRequestRelativePath);
const actionsCode = `import {makeTrackApiRequestActionCreator} from '${trackApiRequestRelativePath}';
import * as rootState from '../state/rootState';

const trackApiRequest = makeTrackApiRequestActionCreator(rootState.getRequestsSlice);`;
fs.writeFileSync(path.resolve(...actionsPath, 'actions.js'), actionsCode);

// create rootState file
const rootStatePath = [...srcPath, ...pageDirs[3]];
let requestsReducerRelativePth = '../../../../redux/state/requests';//relative to routes
arrPath.forEach(i => requestsReducerRelativePth = '../' + requestsReducerRelativePth);
const rootStateCOde = `import {combineReducers} from 'redux';
import requestsReducer from '${requestsReducerRelativePth}';

const rootReducer = combineReducers({
    requests: requestsReducer,
});

export default rootReducer;

export const getRequestsSlice = (state) => state.requests;`;
fs.writeFileSync(path.resolve(...rootStatePath, 'rootState.js'), rootStateCOde);

//create constants file
const constantsPath = [...srcPath, ...arrPath];
fs.writeFileSync(path.resolve(...constantsPath, 'constants.js'), '');
if (exportTOFragments) {
  //create index.jsx
  const indexPath = [...srcPath, ...arrPath];
  const indexCode = `import ${componentName}Container from './components/${componentName}Container';
import * as storeCreator from './redux/createStore';

export {
    ${componentName}Container,
    storeCreator
};`;
  fs.writeFileSync(path.resolve(...indexPath, 'index.jsx'), indexCode);
  //create createStore.js
  const createStorePath = [...srcPath, ...pageDirs[0]];
  let createReduxStoreRelativePath = '../../../redux/store/createReduxStore';
  arrPath.forEach(i => createReduxStoreRelativePath = '../' + createReduxStoreRelativePath);
  const createStoreCode = `import rootReducer from './state/rootState';
import {createReduxStore} from '${createReduxStoreRelativePath}';

export const createStore = () => {
    return createReduxStore(rootReducer);
};`;
  fs.writeFileSync(path.resolve(...createStorePath, 'createStore.js'), createStoreCode);
}