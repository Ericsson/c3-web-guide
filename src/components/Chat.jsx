import React from 'react';
import ReactDOM from 'react-dom';
import SimpleButton from './SimpleButton.jsx';
import {defaultBorder, defaultTextColor, lightGreyColor} from '../constants.js';
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

        this.videoNodeCreated = this.videoNodeCreated.bind(this);
        this.startMoveVideoWindow = this.startMoveVideoWindow.bind(this);
        this.moveVideoWindow = this.moveVideoWindow.bind(this);
    }

    componentDidMount() {
        const clientId = this.props.clientId;

        window[clientId + 'Messages'] = [];
        window[clientId + 'SendMessage'] = () => {};
        window[clientId + 'StartCall'] = () => {};
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

    videoNodeCreated(videoNode) {
        window[this.props.clientId + 'VideoNode'] = videoNode;
    }

    moveVideoWindow(e, videoRect, videoArea, startPos) {
        const newLeft = e.clientX - videoArea.left - startPos.x;
        const newTop = e.clientY - videoArea.top - startPos.y;

        if(newLeft <= 0) {
            this.videoWindow.style.left = '0px';
        } else if (newLeft >= videoArea.width - videoRect.width) {
            this.videoWindow.style.left = `${videoArea.width - videoRect.width - 1}px`
        } else {
            this.videoWindow.style.left = `${newLeft}px`;
        }

        if(newTop <= 0) {
            this.videoWindow.style.top = '0px';
        } else if (newTop >= videoArea.height - videoRect.height) {
            this.videoWindow.style.top = `${videoArea.height - videoRect.height - 1}px`
        } else {
            this.videoWindow.style.top = `${newTop}px`;
        }
    }

    startMoveVideoWindow(e) {
        const videoArea = ReactDOM.findDOMNode(this.videoArea).getBoundingClientRect();
        const videoRect = this.videoWindow.getBoundingClientRect();
        const startPos = {
            x: e.clientX - videoRect.left,
            y: e.clientY - videoRect.top
        };


        const handleMouseMove = function(e) {
            window.getSelection().removeAllRanges();
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
            <div ref={c => {this.videoArea = c}} style={chatStyle}>
                <ChatHeader
                    clientId={this.props.clientId}
                    userId={this.state.userId}
                    userName={this.props.userName}/>
                <ChatMessageList
                    userId={this.state.userId}
                    messages={this.state.messages}/>
                <ChatInput
                    onSendMessage={window[this.props.clientId + 'SendMessage']}
                    onStartCall={window[this.props.clientId + 'StartCall']}/>
                <VideoWindow
                    onVideoWindowCreated={videoWindow => {this.videoWindow = videoWindow}}
                    onVideoNodeCreated={this.videoNodeCreated}
                    onStartMoveVideoWindow={this.startMoveVideoWindow}/>
            </div>
        );
    }
}

class ChatHeader extends React.Component {
    render() {
        const style = {
            borderBottom: defaultBorder,
            color: defaultTextColor,
            background: lightGreyColor,
            display: 'flex',
            alignItems: 'center',
            height: 30
        };

        const clientIdStyle = {
            borderRight: defaultBorder,
            background: '#f0f0f0',
            color: '#b3b3b3',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            padding: '0 5px 0 5px',
            height: 'inherit'
        };

        const userNameStyle = {
            fontWeight: 'bold',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            padding: '0 10px 0 10px'
        };

        return (
            <div style={style}>
                <span style={clientIdStyle}>
                    {this.props.clientId}
                </span>
                <span style={userNameStyle}>
                    {this.props.userName || this.props.userId}
                </span>
            </div>
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

        this.videoWindowCreated = this.videoWindowCreated.bind(this);
        this.videoNodeCreated = this.videoNodeCreated.bind(this);
    }

    videoWindowCreated(videoWindow) {
        // SAFARI
        const observer = new MutationObserver(() => {
            this.setState({videoPlaying: true});
        });
        observer.observe(videoWindow, {childList: true})

        this.props.onVideoWindowCreated(videoWindow);
    }

    videoNodeCreated(videoNode) {
        // CHROME AND FIREFOX
        videoNode.addEventListener('playing', () => {
            this.setState({videoPlaying: true});
        })

        this.props.onVideoNodeCreated(videoNode);
    }

    render() {
        const wrapperStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 125,
            maxWidth: '50%',
            cursor: 'move',
            visibility: this.state.videoPlaying ? 'visible' : 'hidden',
            background: '#555',
            boxShadow: '0px 0px 15px rgba(50, 50, 50, 0.4)',
            border: '1px solid #999',
            overflow: 'hidden',
            borderRadius: 3
        };

        const videoStyle = {
            width: '100%',
            display: 'block'
        }

        return (
            <div style={wrapperStyle}
                 onMouseDown={this.props.onStartMoveVideoWindow}
                 ref={this.videoWindowCreated}>
                <video autoPlay
                       style={videoStyle}
                       ref={this.videoNodeCreated}>
                </video>
            </div>
        );
    }
}

export default Chat;
