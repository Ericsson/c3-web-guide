import React from 'react';
import ToCMenuButton from './ToCMenuButton.jsx';
import {defaultTextColor, defaultBorder, pageTitle, lightGreyColor} from '../constants.js';
import ericssonGradient from '../ericsson_gradient.jpg';
import ericssonLogo from '../ericsson_logo.svg';

class GuideHeader extends React.Component {
    render() {
        const wrapperStyle = {
            borderBottom: defaultBorder,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            background: lightGreyColor,
            overflow: 'hidden'
        };

        const textStyle = {
            margin: 0,
            padding: 5
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

        const ericssonGradientStyle = {
            height: 4,
            width: '101%'
        };

        const ericssonLogoStyle = {
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            height: 30
        };

        return (
            <div style={wrapperStyle}>
                <img src={ericssonGradient} style={ericssonGradientStyle}/>
                <img src={ericssonLogo} style={ericssonLogoStyle}/>
                <h1 style={textStyle}>
                    <a style={linkStyle} href="#">{pageTitle}</a>
                </h1>
                <ToCMenuButton style={ToCMenuButtonStyle} onClick={this.props.onToggleToCMenu}/>
            </div>
        );
    }
}

export default GuideHeader;
