import React from 'react';

class Home extends React.Component {
    render() {
        const pages = this.props.pages;

        const style = {};
        Object.assign(style, this.props.style);

        return (
            <div style={style}>
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
        );
    }
}

export default Home;
