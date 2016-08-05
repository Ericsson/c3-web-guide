import React from 'react';
import ReactDOM from 'react-dom';
import SimpleButton from './SimpleButton.jsx';
import VideoWindow from './VideoWindow.jsx';
import {defaultBorder, defaultTextColor, lightGreyColor} from '../constants.js';
import * as cct from '@cct/libcct';

class Chat extends React.Component {
    constructor() {
        super();

        this.videoNodeCreated = this.videoNodeCreated.bind(this);
        this.startMoveVideoWindow = this.startMoveVideoWindow.bind(this);
        this.moveVideoWindow = this.moveVideoWindow.bind(this);
        this.startCall = this.startCall.bind(this);
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

    startCall() {
        // TODO: Need to check if call function is not empty
        window[this.props.clientId + 'StartCall']();
        this.props.onCallStarted();
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
                    userId={this.props.userId}
                    userName={this.props.userName}/>
                <ChatMessageList
                    userId={this.props.userId}
                    messages={this.props.messages}/>
                <ChatInput
                    onSendMessage={window[this.props.clientId + 'SendMessage']}
                    onStartCall={this.startCall}
                    ongoingCall={this.props.ongoingCall}/>
                <VideoWindow
                    onVideoWindowCreated={videoWindow => {this.videoWindow = videoWindow}}
                    onVideoNodeCreated={this.videoNodeCreated}
                    onStartMoveVideoWindow={this.startMoveVideoWindow}
                    onEndCallButtonClicked={() => {this.props.onEndCall(this.props.clientId)}}
                    ongoingCall={this.props.ongoingCall}/>
            </div>
        );
    }
}

class ChatHeader extends React.Component {
    render() {
        const style = {
            borderBottom: defaultBorder,
            background: lightGreyColor,
            display: 'flex',
            alignItems: 'center',
            height: 30,
            padding: '0 5px 0 5px'
        };

        const userNameStyle = {
            color: defaultTextColor,
            fontWeight: 'bold',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            flex: '1',
            marginRight: 5
        };

        const clientIdStyle = {
            color: '#b3b3b3',
            fontSize: 12
        };

        return (
            <div style={style}>
                <span style={userNameStyle}>
                    {this.props.userName || this.props.userId}
                </span>
                <span style={clientIdStyle}>
                    {this.props.clientId}
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
                <SimpleButton onClick={this.props.onStartCall}
                              disabled={this.props.ongoingCall}>
                    Video call
                </SimpleButton>
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

export default Chat;
