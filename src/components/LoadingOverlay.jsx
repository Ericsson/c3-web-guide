import React from 'react';

class LoadingOverlay extends React.Component {
    render() {
        const style = {
            position: 'absolute',
            top: '0px',
            zIndex: '4',
            width: '100%',
            height: '100%',
            display: this.props.loading ? 'flex' : 'none',
            background: 'rgba(250, 250, 250, 0.8)',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#333'
        }

        return (
            <div style={style}>LOADING...</div>
        );
    }
}

export default LoadingOverlay;
