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
            code: this.props.code,
            ongoingCall: false
        };

        this.runCode = this.runCode.bind(this);
        this.endCall = this.endCall.bind(this);

        window.deviceSources = [];
    }

    componentWillReceiveProps(props) {
        if(this.props.code !== props.code) {
            this.setState({code: props.code});
        }
    }

    runCode() {
        const self = this;
        let code = this.state.code;
        code = injectCode(code);
        eval(code);
        this.forceUpdate();
    }

    endCall(clientId) {
        const calls = window[clientId + 'Room'].calls;
        for(const callId in calls) {
            calls[callId].hangup();
        }

        for(const deviceSource of window.deviceSources) {
            deviceSource.stop();
        }

        this.setState({ongoingCall: false})
    }

    render() {
        const clients = this.props.clients;

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
            width: `${100 / Object.keys(clients).length}%`,
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
                    {Object.keys(clients).map((clientId, index) =>
                        <Chat
                            style={chatStyle}
                            clientId={clientId}
                            userId={clients[clientId].userId}
                            userName={clients[clientId].userName}
                            messages={clients[clientId].messages}
                            onCallStarted={() => {this.setState({ongoingCall: true})}}
                            onEndCall={this.endCall}
                            ongoingCall={this.state.ongoingCall}/>
                    )}
                </div>
                <LoadingOverlay loading={!this.props.clientsInitialized}/>
            </div>
        );
    }
}

export default Playground;
