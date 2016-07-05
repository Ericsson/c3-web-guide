import React from 'react';
import Codearea from './Codearea.jsx';
import Chat from './Chat.jsx';
import LoadingOverlay from './LoadingOverlay.jsx';
import * as cct from '@cct/libcct';

const injections = {
    setName: 'var stateObj = {}; stateObj[caller + "Name"] = response; self.setState(stateObj);'
};

class Playground extends React.Component {
    constructor() {
        super();

        this.state = {
            clients: {},
            currentStage: 0,
            code: {
                stage0: '',
                stage1: '',
                stage2: ''
            }
        };

        this.selectStage = this.selectStage.bind(this);
        this.updateCode = this.updateCode.bind(this);
        this.clearCode = this.clearCode.bind(this);
        this.runCode = this.runCode.bind(this);
    }

    selectStage(stage) {
        this.setState({currentStage: stage})
    }

    updateCode(newCode) {
        let newCodeObj = this.state.code;
        newCodeObj['stage' + this.state.currentStage] = newCode;
        this.setState({code: newCodeObj});
    }

    clearCode() {
        let newCodeObj = this.state.code;
        newCodeObj['stage' + this.state.currentStage] = '';
        this.setState({code: newCodeObj});
    }

    runCode() {
        const self = this;
        let code = this.state.code['stage' + this.state.currentStage];
        const clientVariablePattern = /\bvar\s+(\b.+?)\s?=/g;

        if(this.state.currentStage === 0) {
            let clients = this.state.clients;
            let match = clientVariablePattern.exec(code);
            while(match) {
                clients[match[1]] = {};
                match = clientVariablePattern.exec(code);
            }
        }

        // code = code.replace(clientVariablePattern, '$&window.$1=');

        const clientNames = Object.keys(this.state.clients);
        for(const i in clientNames) {
            const authPattern = new RegExp(`.then\\(${clientNames[i]}.auth\\)`);
            // code = code.replace(authPattern, `$&.then(function(client) {self.state.clients[${clientNames[i]}].user = client.user; return client;})`)
            code = code.replace(authPattern, `$&.then(function(client) {console.log("tes"); return client;})`);
        }

        // for(const functionName in injections) {
        //     const functionPattern = new RegExp(`\(\\b\\w+\)\\.${functionName}\\(.*?\\)`, 'g');
        //     code = code.replace(functionPattern, `$&.then(function(response) {var caller = '$1'; ${injections[functionName]} return response;})`);
        // }

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
                    stages={Object.keys(this.state.code)}
                    code={this.state.code['stage' + this.state.currentStage]}
                    onSelectStage={this.selectStage}
                    onRunCode={this.runCode}
                    onUpdateCode={this.updateCode}
                    onClearCode={this.clearCode}/>
                <div>
                    <Chat
                        style={chatStyle}/>
                    <Chat
                        style={chatStyle}/>
                </div>
            </div>
        );
    }
}

export default Playground;
