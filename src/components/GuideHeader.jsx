import React from 'react';
import ToCMenuButton from './ToCMenuButton.jsx';
import {defaultTextColor, defaultBorder, pageTitle, lightGreyColor} from '../constants.js';
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
            width: '100%',
            background: 'linear-gradient(to right,#a1c517 0,#009045 25%,#0082b6 50%,#151f77 75%,#db004f 100%)'
        };

        const ericssonLogoStyle = {
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            height: 30
        };

        return (
            <header style={wrapperStyle}>
                <div style={ericssonGradientStyle}/>
                <img src={ericssonLogo} style={ericssonLogoStyle}/>
                <h1 style={textStyle}>
                    <a style={linkStyle} href="#">{pageTitle}</a>
                </h1>
                <ToCMenuButton style={ToCMenuButtonStyle} onClick={this.props.onToggleToCMenu}/>
            </header>
        );
    }
}

export default GuideHeader;
