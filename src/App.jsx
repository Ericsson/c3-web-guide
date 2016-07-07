import React from 'react';
import GuideHeader from './components/GuideHeader.jsx';
import Playground from './components/Playground.jsx';
import Markdown from './components/Markdown.jsx';
import PageSelector from './components/PageSelector.jsx';
import {serverUrl, pageTitle} from './constants.js';
import guidePages from './pages.json';
import './base.css';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            numberOfGuidePages: Object.keys(guidePages).length,
            currentPage: 1
        };

        this.setPage = this.setPage.bind(this);
        this.goToPrevPage = this.goToPrevPage.bind(this);
        this.goToNextPage = this.goToNextPage.bind(this);
    }

    setPage() {
        const currentPageId = window.location.hash.substring(1);
        const currentPageKey = Object.keys(guidePages)
            .find(page => guidePages[page].id === currentPageId);
        const currentPage = currentPageKey ? currentPageKey.split('page')[1] : null;

        if(currentPage) {
            this.setState({currentPage});
        } else {
            window.location.hash = guidePages[`page${this.state.currentPage}`].id;
        }

        document.title = `${pageTitle} - ${guidePages[`page${currentPage || this.state.currentPage}`].title}`;
    }

    componentWillMount() {
        this.setPage();
        window.onhashchange = () => {
            this.setPage();
        };
    }

    goToPrevPage() {
        let currentPage = this.state.currentPage;
        if(currentPage > 1) {
            currentPage--;
        } else {
            currentPage = this.state.numberOfGuidePages;
        }
        window.location.hash = guidePages[`page${currentPage}`].id;
    }

    goToNextPage() {
        let currentPage = this.state.currentPage;
        if(currentPage < this.state.numberOfGuidePages) {
            currentPage++;
        } else {
            currentPage = 1;
        }
        window.location.hash = guidePages[`page${currentPage}`].id;
    }

    render() {
        const wrapperStyle = {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        };

        const contentWrapperStyle = {
            flex: '1',
            display: 'flex'
        };

        const playgroundStyle = {
            flex: '1'
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
                            src={guidePages[`page${this.state.currentPage}`].file}/>
                        <PageSelector
                            numberOfPages={this.state.numberOfGuidePages}
                            currentPage={this.state.currentPage}
                            onGoToPrevPage={this.goToPrevPage}
                            onGoToNextPage={this.goToNextPage}/>
                    </div>
                    <Playground
                        style={playgroundStyle}
                        code={require(`raw!./${guidePages[`page${this.state.currentPage}`].code}`)}
                        readOnly={guidePages[`page${this.state.currentPage}`].readOnly}
                        serverUrl={serverUrl}/>
                </div>
            </div>
        );
    }
}

export default App;
