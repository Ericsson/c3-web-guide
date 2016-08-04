import React from 'react';
import GuideHeader from './GuideHeader.jsx';
import Playground from './Playground.jsx';
import Markdown from './Markdown.jsx';
import PageSelector from './PageSelector.jsx';
import Resizer from './Resizer.jsx';

class Guide extends React.Component {
    render() {
        const pages = this.props.pages;
        const currentPageIndex = this.props.currentPageIndex;

        const wrapperStyle = {
            display: 'flex'
        };
        Object.assign(wrapperStyle, this.props.style);

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
                <div style={guidePageWrapperStyle}>
                    <Markdown
                        style={markdownStyle}
                        src={pages[currentPageIndex].text}/>
                    <PageSelector
                        numberOfPages={pages.length}
                        currentPageNumber={currentPageIndex + 1}
                        onGoToPrevPage={this.props.onGoToPrevPage}
                        onGoToNextPage={this.props.onGoToNextPage}/>
                </div>
                <Resizer elementMinSize={200}/>
                <Playground
                    style={playgroundStyle}
                    code={require(`raw!../${pages[currentPageIndex].code}`)}
                    readOnly={pages[currentPageIndex].readOnly}
                    clientIds={this.props.clientIds}
                    clientsAuthenticated={this.props.clientsAuthenticated}/>
            </div>
        );
    }
}

export default Guide;
