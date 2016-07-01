import React from 'react';
import Codearea from './Codearea.jsx';
import Chat from './Chat.jsx';
import LoadingOverlay from './LoadingOverlay.jsx';
import * as cct from '@cct/libcct';

class Playground extends React.Component {
    constructor() {
        super();

        this.state = {
            allClientsAuthenticated: false,
            authenticatedClients: {}
        }

        this.handleClientAuthenticated = this.handleClientAuthenticated.bind(this);
        this.runCode = this.runCode.bind(this);
    }

    componentWillMount() {
        const authenticatedClients = {};
        authenticatedClients[this.props.client1Id] = false;
        authenticatedClients[this.props.client2Id] = false;
        this.setState({authenticatedClients});
    }

    handleClientAuthenticated(clientId) {
        const authenticatedClients = this.state.authenticatedClients;
        authenticatedClients[clientId] = true;
        this.setState({authenticatedClients});

        let allClientsAuthenticated = true;
        for(const client in authenticatedClients) {
            allClientsAuthenticated = authenticatedClients[client];
        }
        this.setState({allClientsAuthenticated});
    }

    runCode(code) {
        eval(code);
        this.forceUpdate();
    }

    render() {
        const wrapperStyle = {
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        };
        Object.assign(wrapperStyle, this.props.style);

        const codeareaStyle = {
            flex: '1'
        };

        const chatWrapperStyle = {
            height: '250px'
        };

        const chatStyle = {
            height: 'inherit',
            width: '50%'
        };

        return (
            <div style={wrapperStyle}>
                <Codearea
                    style={codeareaStyle}
                    onRunCode={this.runCode}/>
                <div style={chatWrapperStyle}>
                    <Chat
                        style={chatStyle}
                        serverUrl={this.props.serverUrl}
                        clientId={this.props.client1Id}
                        onClientAuthenticated={this.handleClientAuthenticated}/>
                    <Chat
                        style={chatStyle}
                        serverUrl={this.props.serverUrl}
                        clientId={this.props.client2Id}
                        onClientAuthenticated={this.handleClientAuthenticated}/>
                </div>
                <LoadingOverlay loading={!this.state.allClientsAuthenticated}/>
            </div>
        );
    }
}

Playground.defaultProps = {
    client1Id: 'client1',
    client2Id: 'client2'
}

export default Playground;
