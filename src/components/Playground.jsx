import React from 'react';
import Codearea from './Codearea.jsx';
import Chat from './Chat.jsx';
import LoadingOverlay from './LoadingOverlay.jsx';
import * as cct from '@cct/libcct';

const injections = [
    {
        pattern: /\bnew\scct.DeviceSource\(.*?\)/g,
        replacement:
            `(function() {
                var deviceSource = $&;
                window.deviceSources.push(deviceSource);
                return deviceSource;
            })()`
    }
];

function injectCode(code) {
    for(const injection of injections) {
        code = code.replace(injection.pattern, injection.replacement);
    }
    return code;
}

class Playground extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            authenticatedClients: {},
            code: this.props.code,
            ongoingCall: false
        };

        this.state.authenticatedClients[this.props.client1Id] = false;
        this.state.authenticatedClients[this.props.client2Id] = false;

        this.handleClientAuthenticated = this.handleClientAuthenticated.bind(this);
        this.runCode = this.runCode.bind(this);
        this.endCall = this.endCall.bind(this);

        window.deviceSources = [];
    }

    componentWillReceiveProps(props) {
        this.setState({code: props.code});
    }

    handleClientAuthenticated(clientId) {
        const authenticatedClients = this.state.authenticatedClients;
        authenticatedClients[clientId] = true;
        this.setState({authenticatedClients});

        if(Object.keys(authenticatedClients).every(key => authenticatedClients[key])) {
            window[clientId].createRoom().then(room => {
                window[clientId + 'Room'] = room;
                const otherClientId = Object.keys(authenticatedClients).find(key => key !== clientId);
                const otherUserId = window[otherClientId].user.id;
                room.invite(otherUserId);
            });
        } else {
            window[clientId].on('invite', room => {
                window[clientId + 'Room'] = room;
                room.join();
                this.setState({loading: false});
            });
        }
    }

    runCode() {
        const self = this;
        let code = this.state.code;
        code = injectCode(code);
        eval(code);
        this.forceUpdate();
    }

    endCall() {
        const calls = window.__C3_SDK_INSTANCES__.client[0].rooms[0].calls;
        calls[Object.keys(calls)[0]].hangup();

        for(const deviceSource of window.deviceSources) {
            deviceSource.stop();
        }

        this.setState({ongoingCall: false})
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
            display: this.props.readOnly ? 'none' : 'block'
        };

        const chatStyle = {
            width: '50%',
            height: 250
        };

        return (
            <div style={wrapperStyle}>
                <Codearea
                    style={codeareaStyle}
                    code={this.state.code}
                    onResetCode={() => {this.setState({code: this.props.code})}}
                    onUpdateCode={code => {this.setState({code})}}
                    onRunCode={this.runCode}
                    readOnly={this.props.readOnly}/>
                <div style={chatWrapperStyle}>
                    <Chat
                        style={chatStyle}
                        serverUrl={this.props.serverUrl}
                        clientId={this.props.client1Id}
                        onClientAuthenticated={this.handleClientAuthenticated}
                        onCallStarted={() => {this.setState({ongoingCall: true})}}
                        onEndCall={this.endCall}
                        ongoingCall={this.state.ongoingCall}/>
                    <Chat
                        style={chatStyle}
                        serverUrl={this.props.serverUrl}
                        clientId={this.props.client2Id}
                        onClientAuthenticated={this.handleClientAuthenticated}
                        onCallStarted={() => {this.setState({ongoingCall: true})}}
                        onEndCall={this.endCall}
                        ongoingCall={this.state.ongoingCall}/>
                </div>
                <LoadingOverlay loading={this.state.loading}/>
            </div>
        );
    }
}

Playground.defaultProps = {
    client1Id: 'client1',
    client2Id: 'client2'
}

export default Playground;
