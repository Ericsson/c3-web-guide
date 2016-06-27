import React from 'react';

class SimpleButton extends React.Component {
    constructor() {
        super();

        this.state = {
            buttonActive: false,
            buttonHover: false
        }

        this.buttonStartHover = this.buttonStartHover.bind(this);
        this.buttonStopHover = this.buttonStopHover.bind(this);
        this.buttonStartClick = this.buttonStartClick.bind(this);
        this.buttonStopClick = this.buttonStopClick.bind(this);
    }

    buttonStartHover() {this.setState({buttonHover: true});}
    buttonStopHover() {this.setState({buttonHover: false});}
    buttonStartClick() {this.setState({buttonActive: true});}
    buttonStopClick() {this.setState({buttonActive: false});}

    render() {
        const style = {
            background: this.state.buttonActive ? '#e1e1e1' : this.state.buttonHover ? '#e6e6e6' : '#f0f0f0',
            border: 'none',
            outline: 'none',
            userSelect: 'none',
            color: '#222',
            cursor: 'pointer'
        };
        Object.assign(style, this.props.style);

        return (
            <button
                style={style}
                onClick={this.props.onClick}
                type={this.props.type || 'button'}
                onMouseEnter={this.buttonStartHover}
                onMouseLeave={this.buttonStopHover}
                onMouseDown={this.buttonStartClick}
                onMouseUp={this.buttonStopClick}>
                {this.props.children}
            </button>
        );
    }
}

export default SimpleButton;
