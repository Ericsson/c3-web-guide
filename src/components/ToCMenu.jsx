import React from 'react';
import {defaultBorder, defaultTextColor} from '../constants.js';

class ToCMenu extends React.Component {
    render() {
        const pages = this.props.pages;

        const wrapperStyle = {
            borderRight: defaultBorder,
            borderBottom: defaultBorder,
            borderBottomRightRadius: 5,
            overflow: 'hidden',
            width: 200
        };
        Object.assign(wrapperStyle, this.props.style);

        const listStyle = {
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            marginBottom: -1,
            background: '#fff'
        };

        return (
            <div style={wrapperStyle}>
                <ul style={listStyle}>
                    <ListItem pageId=' '
                              pageTitle='Home'
                              onClick={this.props.onListItemClicked}/>
                    {Object.keys(pages).map((pageId, index) =>
                        <ListItem key={index}
                                  pageId={pages[pageId].id}
                                  pageTitle={pages[pageId].title}
                                  onClick={this.props.onListItemClicked}/>
                    )}
                </ul>
            </div>
        );
    }
}

class ListItem extends React.Component {
    constructor() {
        super();

        this.state = {
            active: false
        };
    }

    render() {
        const style = {
            padding: '10px 20px',
            boxSizing: 'border-box',
            background: this.state.active ? '#fff' : '#fafafa',
            display: 'inline-block',
            width: '100%',
            textDecoration: 'none',
            color: defaultTextColor,
            borderBottom: defaultBorder
        };

        return (
            <li>
                <a href={`#${this.props.pageId}`}
                   style={style}
                   onClick={this.props.onClick}
                   onMouseEnter={() => {this.setState({active: true})}}
                   onMouseLeave={() => {this.setState({active: false})}}>
                    {this.props.pageTitle}
                </a>
            </li>
        );
    }
}

export default ToCMenu;
