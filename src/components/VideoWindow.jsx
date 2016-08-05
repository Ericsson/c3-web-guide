import React from 'react';

class VideoWindow extends React.Component {
    render() {
        const wrapperStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 125,
            maxWidth: '50%',
            cursor: 'move',
            display: this.props.ongoingCall ? 'inline-block' : 'none',
            background: '#555',
            boxShadow: '0px 0px 15px rgba(50, 50, 50, 0.4)',
            border: '1px solid #999',
            overflow: 'hidden',
            borderRadius: 3
        };

        const videoStyle = {
            width: '100%',
            display: 'block'
        };

        const endCallButtonStyle = {
            position: 'absolute',
            bottom: '7%',
            left: '50%',
            transform: 'translateX(-50%)'
        };

        return (
            <div style={wrapperStyle}
                 onMouseDown={this.props.onStartMoveVideoWindow}
                 ref={this.props.onVideoWindowCreated}>
                <video autoPlay
                       style={videoStyle}
                       ref={this.props.onVideoNodeCreated}>
                </video>
                <EndCallButton style={endCallButtonStyle}
                               onClick={this.props.onEndCallButtonClicked}/>
            </div>
        );
    }
}

class EndCallButton extends React.Component {
    constructor() {
        super();

        this.state = {
            buttonHover: false,
            buttonActive: false
        };
    }

    render() {
        const style = {
            border: '1px solid #AE1828',
            borderRadius: 2,
            background: this.state.buttonHover ? this.state.buttonActive ? '#E31D33' : '#F31E35' : '#FC3A46',
            color: '#fff',
            outline: 'none',
            cursor: 'pointer'
        };
        Object.assign(style, this.props.style);

        return (
            <button onClick={this.props.onClick}
                    style={style}
                    onMouseEnter={() => {this.setState({buttonHover: true})}}
                    onMouseLeave={() => {this.setState({buttonHover: false})}}
                    onMouseDown={() => {this.setState({buttonActive: true})}}
                    onMouseUp={() => {this.setState({buttonActive: false})}}>
                End call
            </button>
        );
    }
}

export default VideoWindow;
