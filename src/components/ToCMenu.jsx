import React from 'react';
import {defaultBorder, defaultTextColor, lightGreyColor} from '../constants.js';

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
            marginBottom: -1
        };

        return (
            <div style={wrapperStyle}>
                <ul style={listStyle}>
                    <ListItem pageId=' '
                              pageTitle='Home'
                              onClick={this.props.onListItemClicked}
                              isCurrentPage={!window.location.hash}/>
                    {Object.keys(pages).map((pageId, index) =>
                        <ListItem key={index}
                                  pageId={pages[pageId].id}
                                  pageTitle={pages[pageId].title}
                                  isCurrentPage={window.location.hash && pageId.split('page')[1] === this.props.currentPage}
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
            background: this.state.active || this.props.isCurrentPage ? '#fff' : lightGreyColor,
            display: 'inline-block',
            width: '100%',
            textDecoration: 'none',
            color: defaultTextColor,
            borderBottom: defaultBorder,
            fontWeight: '500'
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
