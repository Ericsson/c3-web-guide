import React from 'react';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';

class Markdown extends React.Component {
    rawMarkup() {
        const file = require('../' + this.props.src);
        return {__html: file};
    }

    render() {
        return (
            <div style={this.props.style} className='markdown-body' dangerouslySetInnerHTML={this.rawMarkup()}/>
        );
    }
}

Markdown.propTypes = {
    src: React.PropTypes.string.isRequired
}

export default Markdown;
