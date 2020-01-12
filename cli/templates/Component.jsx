import React from 'react';
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
}