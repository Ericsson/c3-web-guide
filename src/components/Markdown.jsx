import React from 'react';
import 'github-markdown-css/github-markdown.css';

class Markdown extends React.Component {
    rawMarkup() {
        const file = require('../' + this.props.src);
        return {__html: file};
    }

    render() {
        return (
            <div className='markdown-body' dangerouslySetInnerHTML={this.rawMarkup()}/>
        );
    }
}

Markdown.propTypes = {
    src: React.PropTypes.string.isRequired
}

export default Markdown;
