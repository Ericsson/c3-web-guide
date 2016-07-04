import React from 'react';
import ReactDOM from 'react-dom';
import SimpleButton from './SimpleButton.jsx';
import {defaultBorder, defaultTextColor} from '../constants.js';
import * as cct from '@cct/libcct';

function pushObserver(arr, callback) {
    arr.push = function(e) {
        Array.prototype.push.call(arr, e);
        callback(arr);
    };
};

class Chat extends React.Component {
    constructor() {
        super();

        this.state = {
            userId: undefined,
            messages: []
        };

        this.startMoveVideoWindow = this.startMoveVideoWindow.bind(this);
        this.moveVideoWindow = this.moveVideoWindow.bind(this);
    }

    componentDidMount() {
        const clientId = this.props.clientId;
        this.videoNode = ReactDOM.findDOMNode(this.videoWindow);

        window[clientId + 'Messages'] = [];
        window[clientId + 'SendMessage'] = () => {};
        window[clientId + 'StartCall'] = () => {};
        window[clientId + 'VideoNode'] = this.videoNode;
        window[clientId] = new cct.Client();

        pushObserver(window[clientId + 'Messages'], arr => {
            this.setState({messages: arr});
        });

        cct.Auth.anonymous({serverUrl: this.props.serverUrl})
            .then(window[clientId].auth)
            .then(client => {
                this.props.onClientAuthenticated(clientId);
                this.setState({userId: client.user.id});
            });
    }

    moveVideoWindow(e, videoRect, videoArea, startPos) {
        const newLeft = e.clientX - videoArea.left - startPos.x;
        const newTop = e.clientY - videoArea.top - startPos.y;

        if(newLeft <= 0) {
            this.videoNode.style.left = '0px';
        } else if (newLeft >= videoArea.width - videoRect.width) {
            this.videoNode.style.left = `${videoArea.width - videoRect.width - 1}px`
        } else {
            this.videoNode.style.left = `${newLeft}px`;
        }

        if(newTop <= 0) {
            this.videoNode.style.top = '0px';
        } else if (newTop >= videoArea.height - videoRect.height) {
            this.videoNode.style.top = `${videoArea.height - videoRect.height - 1}px`
        } else {
            this.videoNode.style.top = `${newTop}px`;
        }
    }

    startMoveVideoWindow(e) {
        const videoArea = ReactDOM.findDOMNode(this.videoArea).getBoundingClientRect();
        const videoRect = this.videoNode.getBoundingClientRect();
        const startPos = {
            x: e.clientX - e.target.getBoundingClientRect().left,
            y: e.clientY - e.target.getBoundingClientRect().top
        };

        const handleMouseMove = function(e) {
            this.moveVideoWindow(e, videoRect, videoArea, startPos);
        }.bind(this);

        const handleMouseUp = function() {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    render() {
        let chatStyle = {
            border: defaultBorder,
            display: 'inline-flex',
            position: 'relative',
            flexDirection: 'column',
            boxSizing: 'border-box'
        };
        Object.assign(chatStyle, this.props.style);

        return (
            <div ref={c => this.videoArea = c} style={chatStyle}>
                <ChatHeader
                    clientId={this.props.clientId}/>
                <ChatMessageList
                    userId={this.state.userId}
                    messages={this.state.messages}/>
                <ChatInput
                    onSendMessage={window[this.props.clientId + 'SendMessage']}
                    onStartCall={window[this.props.clientId + 'StartCall']}/>
                <VideoWindow
                    ref={c => this.videoWindow = c}
                    onStartMoveVideoWindow={this.startMoveVideoWindow}/>
            </div>
        );
    }
}

class ChatHeader extends React.Component {
    render() {
        const style = {
            textAlign: 'center',
            fontFamily: 'Helvetica, Arial, sans-serif',
            borderBottom: defaultBorder,
            padding: 5,
            fontWeight: 'bold',
            color: defaultTextColor
        }

        return (
            <div style={style}>{this.props.clientId}</div>
        );
    }
}

class ChatMessageList extends React.Component {
    componentDidUpdate() {
        this.chatMessageList.scrollTop = this.chatMessageList.scrollHeight;
    }

    render() {
        const chatMessages = this.props.messages.map(message =>
            <ChatMessage
                key={message.messageId}
                message={message.text}
                authorId={message.authorId}
                userId={this.props.userId}/>
        );

        const style = {
            flex: '1',
            overflow: 'auto',
            padding: 5
        };

        return (
            <div
                style={style}
                ref={c => this.chatMessageList = c}>
                {chatMessages}
            </div>
        );
    }
}

class ChatMessage extends React.Component {
    render() {
        const messageStyle = {
            fontFamily: 'sans-serif',
            background: this.props.authorId === this.props.userId ? '#1496F0' : '#E6E6E6',
            color: this.props.authorId === this.props.userId ? '#fff' : '#222',
            padding: '6px 8px',
            float: this.props.authorId === this.props.userId ? 'right' : 'left',
            clear: 'both',
            borderRadius: 12,
            fontSize: 12,
            margin: 4,
            maxWidth: '80%'
        };

        return (
            <span style={messageStyle}>
                {this.props.message}
            </span>
        );
    }
}

class ChatInput extends React.Component {
    constructor() {
        super();
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    handleSendMessage(e) {
        e.preventDefault();
        if(!this.chatInput.value) {
            return;
        }

        this.props.onSendMessage(this.chatInput.value);
        this.chatInput.value = '';
    }

    render() {
        const wrapperStyle = {
            borderTop: defaultBorder,
            display: 'flex'
        }

        const formStyle = {
            display: 'flex',
            flex: '1'
        };

        const inputStyle = {
            flex: '1',
            outline: 'none',
            padding: 5,
            margin: 0,
            border: 'none',
            width: '100%',
            minWidth: 0,
            borderLeft: defaultBorder,
            borderRight: defaultBorder
        };

        return (
            <div style={wrapperStyle}>
                <SimpleButton onClick={this.props.onStartCall}>Video call</SimpleButton>
                <form style={formStyle} onSubmit={this.handleSendMessage}>
                    <input
                        style={inputStyle}
                        placeholder='Write a message...'
                        ref={c => this.chatInput = c}
                        type='text'/>
                    <SimpleButton type='submit'>Send</SimpleButton>
                </form>
            </div>
        );
    }
}

class VideoWindow extends React.Component {
    constructor() {
        super();
        this.state = {
            videoPlaying: false
        };
    }
    componentDidMount() {
        this.videoNode.addEventListener('playing', () => {
            this.setState({videoPlaying: true});
        })
    }

    render() {
        const style = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 125,
            maxWidth: '50%',
            cursor: 'move',
            display: this.state.videoPlaying ? 'inline-block' : 'none',
            boxShadow: '0px 0px 15px rgba(50, 50, 50, 0.4)',
            border: '1px solid rgba(50, 50, 50, 0.5)',
            borderRadius: 3
        };

        return (
            <video
                style={style}
                autoPlay
                onMouseDown={this.props.onStartMoveVideoWindow}
                ref={c => this.videoNode = c}>
            </video>
        );
    }
}

export default Chat;
