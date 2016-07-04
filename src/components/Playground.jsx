import React from 'react';
import Codearea from './Codearea.jsx';
import Chat from './Chat.jsx';
import LoadingOverlay from './LoadingOverlay.jsx';
import * as cct from '@cct/libcct';

const injections = {
    setName: 'var stateObj = {}; stateObj[caller + "Name"] = response; self.setState(stateObj);'
};

function injectCode(code) {
    for(const functionName in injections) {
        const pattern = new RegExp(`\(\\b\\w+\)\\.${functionName}\\(.*?\\)`, 'g');
        code = code.replace(pattern, `$&.then(function(response) {var caller = '$1'; ${injections[functionName]} return response;})`);
    }
    return code;
}

class Playground extends React.Component {
    constructor() {
        super();

        this.state = {
            allClientsAuthenticated: false,
            authenticatedClients: {}
        };

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
        const self = this;
        code = injectCode(code);
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

        const chatStyle = {
            width: '50%',
            height: 250
        };

        return (
            <div style={wrapperStyle}>
                <Codearea
                    style={codeareaStyle}
                    onRunCode={this.runCode}/>
                <div>
                    <Chat
                        style={chatStyle}
                        serverUrl={this.props.serverUrl}
                        clientId={this.props.client1Id}
                        clientName={this.state[this.props.client1Id + 'Name']}
                        onClientAuthenticated={this.handleClientAuthenticated}/>
                    <Chat
                        style={chatStyle}
                        serverUrl={this.props.serverUrl}
                        clientId={this.props.client2Id}
                        clientName={this.state[this.props.client2Id + 'Name']}
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
