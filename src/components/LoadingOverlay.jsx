import React from 'react';
import {defaultTextColor} from '../constants.js';

class LoadingOverlay extends React.Component {
    render() {
        const style = {
            position: 'absolute',
            top: 0,
            zIndex: '4',
            width: '100%',
            height: '100%',
            display: this.props.loading ? 'flex' : 'none',
            background: 'rgba(250, 250, 250, 0.8)',
            fontWeight: 'bold',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            color: defaultTextColor
        }

        return (
            <div style={style}>LOADING...</div>
        );
    }
}

export default LoadingOverlay;
