import React from 'react';
import GuideHeader from './GuideHeader.jsx';
import Playground from './Playground.jsx';
import Markdown from './Markdown.jsx';
import PageSelector from './PageSelector.jsx';
import Resizer from './Resizer.jsx';

class Guide extends React.Component {
    render() {
        const wrapperStyle = {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        };
        Object.assign(wrapperStyle, this.props.style);

        const contentWrapperStyle = {
            flex: '1',
            display: 'flex'
        };

        const playgroundStyle = {
            flex: '1',
            overflow: 'auto'
        };

        const guidePageWrapperStyle = {
            flex: '1',
            display: 'flex',
            flexDirection: 'column'
        };

        const markdownStyle = {
            flex: '1',
            flexBasis: 0,
            overflow: 'auto',
            padding: 20
        };

        return (
            <div style={wrapperStyle}>
                <GuideHeader/>
                <div style={contentWrapperStyle}>
                    <div style={guidePageWrapperStyle}>
                        <Markdown
                            style={markdownStyle}
                            src={this.props.pages[`page${this.props.currentPage}`].file}/>
                        <PageSelector
                            numberOfPages={Object.keys(this.props.pages).length}
                            currentPage={this.props.currentPage}
                            onGoToPrevPage={this.props.onGoToPrevPage}
                            onGoToNextPage={this.props.onGoToNextPage}/>
                    </div>
                    <Resizer elementMinSize={200}/>
                    <Playground
                        style={playgroundStyle}
                        code={require(`raw!../${this.props.pages[`page${this.props.currentPage}`].code}`)}
                        readOnly={this.props.pages[`page${this.props.currentPage}`].readOnly}
                        serverUrl={this.props.serverUrl}/>
                </div>
            </div>
        );
    }
}

export default Guide;
