import React from 'react';
import ReactDOM from 'react-dom';
import GuideHeader from './components/GuideHeader.jsx';
import ToCMenu from './components/ToCMenu.jsx';
import Home from './components/Home.jsx';
import Guide from './components/Guide.jsx';
import pages from './pages.json';
import {serverUrl, pageTitle, clientIds} from './constants.js';
import * as cct from '@cct/libcct';
import './base.css';

function pushObserver(arr, callback) {
    arr.push = function(e) {
        Array.prototype.push.call(arr, e);
        callback(arr);
    };
};

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            currentState: 'home',
            currentPageIndex: 0,
            clientsInitialized: false,
            changingHash: false,
            clients: {},
            showToCMenu: false
        };

        this.updateClientData = this.updateClientData.bind(this);
        this.initializeClients = this.initializeClients.bind(this);
        this.handleRoute = this.handleRoute.bind(this);
        this.setCurrentPageIndex = this.setCurrentPageIndex.bind(this);
        this.goToPrevPage = this.goToPrevPage.bind(this);
        this.goToNextPage = this.goToNextPage.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.toggleToCMenu = this.toggleToCMenu.bind(this);

        this.initializeClients();
    }

    updateClientData(clientId, data) {
        const clients = this.state.clients;
        Object.assign(clients[clientId], data);
        this.setState({clients});
    }

    initializeClients() {
        const promises = [];

        clientIds.forEach(() => {
            const client = new cct.Client();
            promises.push(
                cct.Auth.anonymous({serverUrl})
                    .then(client.auth)
            );
        });

        Promise.all(promises).then(clients => {
            clientIds.forEach((clientId, index) => {
                const client = clients[index];

                const newClients = this.state.clients;
                newClients[clientId] = {
                    messages: [],
                    userId: client.user.id,
                    userName: undefined
                };
                this.setState({clients: newClients});

                window[clientId] = client;
                window[clientId + 'Messages'] = [];
                window[clientId + 'SendMessage'] = () => {};
                window[clientId + 'StartCall'] = () => {};

                client.user.on('name', userName => {
                    this.updateClientData(clientId, {userName});
                });

                pushObserver(window[clientId + 'Messages'], messages => {
                    this.updateClientData(clientId, {messages});
                });

                if(index === clientIds.length - 1) {
                    client.createRoom().then(room => {
                        window[clientId + 'Room'] = room;
                        room.on('members', () => {
                            if(room.members.length === clientIds.length) {
                                this.setState({clientsInitialized: true});
                            }
                        });
                        for(let i = 0; i < clientIds.length - 1; i++) {
                            room.invite(clients[i].user.id);
                        }
                    });
                } else {
                    client.once('invite', room => {
                        window[clientId + 'Room'] = room;
                        room.join();
                    });
                }
            });
        });
    }

    handleRoute() {
        const pageId = window.location.hash.substring(1);
        const pageIndex = pages.findIndex(page => page.pageId === pageId);

        if(pageIndex >= 0) {
            this.setState({
                currentState: 'guide',
                currentPageIndex: pageIndex
            });
            document.title = `${pageTitle} - ${pages[pageIndex].title}`;
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

    setCurrentPageIndex(pageIndex) {
        this.setState({
            currentPageIndex: pageIndex,
            changingHash: true
        });

        window.location.hash = pages[pageIndex].pageId;
        document.title = `${pageTitle} - ${pages[pageIndex].title}`;
    }

    goToPrevPage() {
        let pageIndex = this.state.currentPageIndex;

        if(pageIndex > 0) {
            pageIndex--;
        } else {
            pageIndex = pages.length - 1;
        }

        this.setCurrentPageIndex(pageIndex);
    }

    goToNextPage() {
        let pageIndex = this.state.currentPageIndex;

        if(pageIndex < pages.length - 1) {
            pageIndex++;
        } else {
            pageIndex = 0;
        }

        this.setCurrentPageIndex(pageIndex);
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
        if(this.state.showToCMenu) {
            this.homeNode && this.homeNode.removeEventListener('click', this.clickHandler);
            this.guideNode && this.guideNode.removeEventListener('click', this.clickHandler);
        } else {
            this.homeNode && this.homeNode.addEventListener('click', this.clickHandler);
            this.guideNode && this.guideNode.addEventListener('click', this.clickHandler);
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
        };

        const guideStyle = {
            flex: '1',
        };

        const ToCMenuStyle = {
            position: 'absolute',
            top: this.headerNode && this.headerNode.offsetHeight,
            transform: `translateX(${this.state.showToCMenu ? '0' : '-100%'})`,
            transition: 'transform 0.15s'
        };

        return (
            <div style={wrapperStyle}>
                <GuideHeader onToggleToCMenu={this.toggleToCMenu}
                             ref={node => {this.headerNode = ReactDOM.findDOMNode(node)}}/>
                <ToCMenu style={ToCMenuStyle}
                         pages={pages}
                         currentState={this.state.currentState}
                         currentPageIndex={this.state.currentPageIndex}
                         onListItemClicked={this.toggleToCMenu}/>
                {(() => {
                    switch(this.state.currentState) {
                        case 'guide':
                            return <Guide style={guideStyle}
                                       pages={pages}
                                       currentPageIndex={this.state.currentPageIndex}
                                       onGoToPrevPage={this.goToPrevPage}
                                       onGoToNextPage={this.goToNextPage}
                                       clients={this.state.clients}
                                       clientsInitialized={this.state.clientsInitialized}
                                       ref={node => {this.guideNode = ReactDOM.findDOMNode(node)}}/>
                        case 'home':
                        default:
                            return <Home style={homeStyle}
                                       pages={pages}
                                       ref={node => {this.homeNode = ReactDOM.findDOMNode(node)}}/>

                    }
                })()}
            </div>
        );
    }
}

export default App;
