import React from 'react';
import ReactDOM from 'react-dom';
import GuideHeader from './components/GuideHeader.jsx';
import ToCMenu from './components/ToCMenu.jsx';
import Home from './components/Home.jsx';
import Guide from './components/Guide.jsx';
import pages from './pages.json';
import {serverUrl, pageTitle} from './constants.js';
import './base.css';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            currentState: 'home',
            currentPage: 'installation',
            changingHash: false,
            showToCMenu: false
        };

        this.handleRoute = this.handleRoute.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);
        this.goToPrevPage = this.goToPrevPage.bind(this);
        this.goToNextPage = this.goToNextPage.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.toggleToCMenu = this.toggleToCMenu.bind(this);
    }

    handleRoute() {
        const pageId = window.location.hash.substring(1);

        if(pageId in pages) {
            this.setState({
                currentState: 'guide',
                currentPage: pageId
            });
            document.title = `${pageTitle} - ${pages[pageId].title}`;
        } else if (pageId) {
            this.setState({
                currentState: 'home',
                changingHash: true
            });
            window.location.hash = ' ';
            document.title = pageTitle;
        } else {
            this.setState({currentState: 'home'});
            document.title = pageTitle;
        }
    }

    setCurrentPage(pageNumber) {
        const pageId = Object.keys(pages).find(pageId => pages[pageId].pageNumber === pageNumber);

        this.setState({
            currentPage: pageId,
            changingHash: true
        });

        window.location.hash = pageId;
        document.title = `${pageTitle} - ${pages[pageId].title}`;
    }

    goToPrevPage() {
        let pageNumber = pages[this.state.currentPage].pageNumber;

        if(pageNumber > 1) {
            pageNumber--;
        } else {
            pageNumber = Object.keys(pages).length;
        }

        this.setCurrentPage(pageNumber);
    }

    goToNextPage() {
        let pageNumber = pages[this.state.currentPage].pageNumber;

        if(pageNumber < Object.keys(pages).length) {
            pageNumber++;
        } else {
            pageNumber = 1;
        }

        this.setCurrentPage(pageNumber);
    }

    componentWillMount() {
        this.handleRoute();
        window.onhashchange = () => {
            if(this.state.changingHash) {
                this.setState({changingHash: false});
            } else {
                this.handleRoute();
            }
        }
    }

    clickHandler() {
        this.toggleToCMenu();
    }

    toggleToCMenu() {
        const homeNode = ReactDOM.findDOMNode(this.home);
        const guideNode = ReactDOM.findDOMNode(this.guide);

        if(this.state.showToCMenu) {
            homeNode.removeEventListener('click', this.clickHandler);
            guideNode.removeEventListener('click', this.clickHandler);
        } else {
            homeNode.addEventListener('click', this.clickHandler);
            guideNode.addEventListener('click', this.clickHandler);
        }

        this.setState({showToCMenu: !this.state.showToCMenu});
    }

    render() {
        const wrapperStyle = {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
        };

        const homeStyle = {
            flex: '1',
            display: this.state.currentState === 'home' ? 'block' : 'none'
        };

        const guideStyle = {
            flex: '1',
            display: this.state.currentState === 'guide' ? 'flex' : 'none'
        };

        const ToCMenuStyle = {
            position: 'absolute',
            transform: `translateX(${this.state.showToCMenu ? '0' : '-100%'})`,
            transition: 'transform 0.15s'
        };

        return (
            <div style={wrapperStyle}>
                <GuideHeader onToggleToCMenu={this.toggleToCMenu}/>
                <ToCMenu style={ToCMenuStyle}
                         pages={pages}
                         onListItemClicked={this.toggleToCMenu}/>
                <Home style={homeStyle}
                      pages={pages}
                      ref={node => {this.home = node}}/>
                <Guide style={guideStyle}
                       pages={pages}
                       currentPage={this.state.currentPage}
                       onGoToPrevPage={this.goToPrevPage}
                       onGoToNextPage={this.goToNextPage}
                       serverUrl={serverUrl}
                       ref={node => {this.guide = node}}/>
            </div>
        );
    }
}

export default App;
