import React from 'react';
import {defaultTextColor, defaultBorder, pageTitle} from '../constants.js';

class GuideHeader extends React.Component {
    render() {
        const wrapperStyle = {
            borderBottom: defaultBorder,
            textAlign: 'center'
        };

        const textStyle = {
            margin: 0,
            padding: '5px 0'
        };

        const linkStyle = {
            color: defaultTextColor,
            textDecoration: 'none'
        };

        return (
            <div style={wrapperStyle}>
                <h1 style={textStyle}>
                    <a style={linkStyle} href="#">{pageTitle}</a>
                </h1>
            </div>
        );
    }
}

export default GuideHeader;
