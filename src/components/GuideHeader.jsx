import React from 'react';
import ToCMenuButton from './ToCMenuButton.jsx';
import {defaultTextColor, defaultBorder, pageTitle} from '../constants.js';

class GuideHeader extends React.Component {
    render() {
        const wrapperStyle = {
            borderBottom: defaultBorder,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: 50,
            zIndex: 1,
            background: '#fff'
        };

        const textStyle = {
            margin: 0
        };

        const linkStyle = {
            color: defaultTextColor,
            textDecoration: 'none'
        };

        const ToCMenuButtonStyle = {
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)'
        };

        return (
            <div style={wrapperStyle}>
                <h1 style={textStyle}>
                    <a style={linkStyle} href="#">{pageTitle}</a>
                </h1>
                <ToCMenuButton style={ToCMenuButtonStyle} onClick={this.props.onToggleToCMenu}/>
            </div>
        );
    }
}

export default GuideHeader;
