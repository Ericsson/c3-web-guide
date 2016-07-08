import React from 'react';
import {defaultTextColor, defaultBorder, pageTitle} from '../constants.js';

class GuideHeader extends React.Component {
    render() {
        const wrapperStyle = {
            borderBottom: defaultBorder,
            textAlign: 'center'
        };

        const textStyle = {
            color: defaultTextColor,
            margin: 0,
            padding: '5px 0'
        };

        return (
            <div style={wrapperStyle}>
                <h1 style={textStyle}>{pageTitle}</h1>
            </div>
        );
    }
}

export default GuideHeader;
