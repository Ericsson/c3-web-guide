import React from 'react';
import {defaultTextColor} from '../constants.js';

class ToCMenuButton extends React.Component {
    constructor() {
        super();

        this.state = {
            buttonHover: false
        };
    }

    render() {
        const style = {
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            color: this.state.buttonHover ? '#999' : defaultTextColor,
            padding: 0,
            fontSize: 30
        };
        Object.assign(style, this.props.style);

        return (
            <button style={style}
                    onMouseEnter={() => {this.setState({buttonHover: true})}}
                    onMouseLeave={() => {this.setState({buttonHover: false})}}
                    onClick={this.props.onClick}>
                ☰
            </button>
        );
    }
}

export default ToCMenuButton;
