import React from 'react';
import Markdown from './Markdown.jsx';
import {defaultTextColor, defaultBorder, lightGreyColor} from '../constants.js'

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

        return (
            <div style={wrapperStyle}>
                <div style={style}>
                    <Markdown src='home.md'/>
                    <ul style={listStyle}>
                        {Object.keys(pages).map((pageId, index) =>
                            <ListItem key={index}
                                      href={`#${pageId}`}
                                      title={pages[pageId].title}
                                      description={pages[pageId].description}/>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

class ListItem extends React.Component {
    render() {
        const listItemStyle = {
            border: defaultBorder,
            borderRadius: 3,
            padding: 20,
            background: lightGreyColor,
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
            <li style={listItemStyle}>
                <a href={this.props.href} style={listItemTitleStyle}>
                    {this.props.title}
                </a>
                <p style={listItemDescriptionStyle}>
                    {this.props.description}
                </p>
            </li>
        );
    }
}

export default Home;
