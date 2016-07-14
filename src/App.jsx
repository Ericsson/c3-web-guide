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
            currentPage: 1,
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
        const hash = window.location.hash.substring(1);
        const currentPageKey = Object.keys(pages)
            .find(page => pages[page].id === hash);

        if(currentPageKey) {
            this.setState({
                currentState: 'guide',
                currentPage: currentPageKey.split('page')[1]
            });
            document.title = `${pageTitle} - ${pages[currentPageKey].title}`;
        } else if (hash) {
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

    setCurrentPage(page) {
        this.setState({
            currentPage: page,
            changingHash: true
        });
        window.location.hash = pages[`page${page}`].id
        document.title = `${pageTitle} - ${pages[`page${page}`].title}`;
    }

    goToPrevPage() {
        let currentPage = this.state.currentPage;

        if(currentPage > 1) {
            currentPage--;
        } else {
            currentPage = Object.keys(pages).length;
        }

        this.setCurrentPage(currentPage);
    }

    goToNextPage() {
        let currentPage = this.state.currentPage;

        if(currentPage < Object.keys(pages).length) {
            currentPage++;
        } else {
            currentPage = 1;
        }

        this.setCurrentPage(currentPage);
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
                         currentPage={this.state.currentPage}
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
