import React from 'react';
import {defaultBorder, defaultTextColor} from '../constants.js';

class PageSelector extends React.Component {
    render() {
        const wrapperStyle = {
            borderTop: defaultBorder,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
        };

        const currentPageStyle = {
            fontSize: 18,
            fontWeight: 'bold',
            color: defaultTextColor,
            margin: 'auto 10px'
        };

        const buttonStyle = {
            background: 'none',
            border: 'none',
            outline: 'none',
            fontWeight: 'bold',
            color: defaultTextColor,
            cursor: 'pointer',
            fontSize: 20
        };

        return (
            <div style={wrapperStyle}>
                <button
                    style={buttonStyle}
                    onClick={this.props.onGoToPrevPage}>
                    {'<'}
                </button>
                <span style={currentPageStyle}>
                    {this.props.currentPage} / {this.props.numberOfPages}
                </span>
                <button
                    style={buttonStyle}
                    onClick={this.props.onGoToNextPage}>
                    {'>'}
                </button>
            </div>
        );
    }
}

export default PageSelector;
