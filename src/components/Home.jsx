import React from 'react';
import Markdown from './Markdown.jsx';
import {defaultTextColor, defaultBorder} from '../constants.js'

class Home extends React.Component {
    render() {
        const pages = this.props.pages;

        const wrapperStyle = {
            overflow: 'auto'
        };
        Object.assign(wrapperStyle, this.props.style);

        const style = {
            width: '100%',
            maxWidth: 800,
            padding: 20,
            margin: '0 auto',
            boxSizing: 'border-box'
        };

        const listStyle = {
            listStyleType: 'none',
            padding: 0
        };

        const listItemStyle = {
            border: defaultBorder,
            borderRadius: 3,
            padding: 20,
            background: '#fafafa',
            marginTop: 10,
            marginBottom: 10
        };

        const listItemTitleStyle = {
            textDecoration: 'none',
            color: defaultTextColor,
            display: 'inline-block',
            marginBottom: '10px',
            fontWeight: 'bold',
            fontSize: 20
        };

        const listItemDescriptionStyle = {
            color: '#777',
            margin: 0
        };

        return (
            <div style={wrapperStyle}>
                <div style={style}>
                    <Markdown src="home.md"/>
                    <ul style={listStyle}>
                        {Object.keys(pages).map((pageId, index) =>
                            <li key={index} style={listItemStyle}>
                                <a href={`#${pages[pageId].id}`} style={listItemTitleStyle}>
                                    {pages[pageId].title}
                                </a>
                                <p style={listItemDescriptionStyle}>
                                    {pages[pageId].description}
                                </p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Home;
