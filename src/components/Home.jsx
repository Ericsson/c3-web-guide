import React from 'react';
import Markdown from './Markdown.jsx';

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
            margin: '0 auto'
        };

        return (
            <div style={wrapperStyle}>
                <div style={style}>
                    <Markdown src="home.md"/>
                    <ul>
                        {Object.keys(pages).map((pageId, index) =>
                            <li key={index}>
                                <a href={`#${pages[pageId].id}`}>
                                    {pages[pageId].title}
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Home;
