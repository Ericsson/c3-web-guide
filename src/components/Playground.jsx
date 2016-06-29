import React from 'react';
import ReactDOM from 'react-dom';
import Codearea from './Codearea.jsx';
import SimpleButton from './SimpleButton.jsx';
import * as cct from '@cct/libcct';

window.videoNode1 = undefined;
window.videoNdoe2 = undefined;
window.client1Messages = [];
window.client2Messages = [];
window.client1SendMessage = () => {};
window.client2SendMessage = () => {};
window.client1StartCall = () => {};
window.client2StartCall = () => {};

function pushObserver(arr, callback) {
    arr.push = function(e) {
        Array.prototype.push.call(arr, e);
        callback(arr);
    };
};

class Playground extends React.Component {
    constructor() {
        super();

        this.state = {
            client1Messages: window.client1Messages,
            client2Messages: window.client2Messages
        }

        this.runCode = this.runCode.bind(this);
        pushObserver(window.client1Messages, arr => {
            this.setState({client1Messages: arr});
        });

        pushObserver(window.client2Messages, arr => {
            this.setState({client2Messages: arr});
        });
    }

    runCode(code) {
        eval(code);
        this.forceUpdate();
    }

    videoNode1Created(node) {
        window.videoNode1 = node;
    }

    videoNode2Created(node) {
        window.videoNode2 = node;
    }

    render() {
        const wrapperStyle = {
            display: 'flex',
            flexDirection: 'column'
        };
        Object.assign(wrapperStyle, this.props.style);

        const codeareaStyle = {
            flex: '1'
        };

        const chatStyle = {
            height: '250px',
            width: '50%'
        };

        return (
            <div style={wrapperStyle}>
                <Codearea
                    style={codeareaStyle}
                    onRunCode={this.runCode}/>
                <div>
                    <Chat
                        style={chatStyle}
                        userId='user1'
                        messages={this.state.client1Messages}
                        onSendMessage={window.client1SendMessage}
                        onStartCall={window.client1StartCall}
                        onVideoNodeCreated={this.videoNode1Created}/>
                    <Chat
                        style={chatStyle}
                        userId='user2'
                        messages={this.state.client2Messages}
                        onStartCall={window.client2StartCall}
                        onSendMessage={window.client2SendMessage}
                        onVideoNodeCreated={this.videoNode2Created}/>
                </div>
            </div>
        );
    }
}

class Chat extends React.Component {
    constructor() {
        super();

        this.state = {
            movingVideo: false,
            videoMoveStartPosition: {
                x: undefined,
                y: undefined
            }
        };

        this.startMoveVideoWindow = this.startMoveVideoWindow.bind(this);
        this.moveVideoWindow = this.moveVideoWindow.bind(this);
    }

    componentDidMount() {
        this.videoNode = ReactDOM.findDOMNode(this.videoWindow);
        this.props.onVideoNodeCreated(this.videoNode);
    }

    startMoveVideoWindow(e) {
        this.setState({movingVideo: true});
        this.setState({videoMoveStartPosition: {
            x: e.clientX - e.target.getBoundingClientRect().left,
            y: e.clientY - e.target.getBoundingClientRect().top
        }})
        const handleMouseUp = function() {
        window.removeEventListener('mouseup', handleMouseUp);
            this.setState({movingVideo: false});
        }.bind(this);
        window.addEventListener('mouseup', handleMouseUp);
    }

    moveVideoWindow(e) {
        const overlayRect = e.target.getBoundingClientRect();
        const videoRect = this.videoNode.getBoundingClientRect();

        const newLeft = e.clientX - overlayRect.left - this.state.videoMoveStartPosition.x;
        const newTop = e.clientY - overlayRect.top - this.state.videoMoveStartPosition.y;

        if(newLeft <= 0) {
            this.videoNode.style.left = '0px';
        } else if (newLeft >= overlayRect.width - videoRect.width) {
            this.videoNode.style.left = `${overlayRect.width - videoRect.width}px`
        } else {
            this.videoNode.style.left = `${newLeft}px`;
        }

        if(newTop <= 0) {
            this.videoNode.style.top = '0px';
        } else if (newTop >= overlayRect.height - videoRect.height) {
            this.videoNode.style.top = `${overlayRect.height - videoRect.height}px`
        } else {
            this.videoNode.style.top = `${newTop}px`;
        }
    }

    render() {
        let wrapperStyle = {
            display: 'inline-block',
            position: 'relative',
            width: '100%',
            height: '200px'
        };
        Object.assign(wrapperStyle, this.props.style);

        const chatStyle = {
            border: '1px solid #e1e1e1',
            display: 'flex',
            height: 'inherit',
            flexDirection: 'column',
            boxSizing: 'border-box'
        };

        return (
            <div style={wrapperStyle}>
                <div style={chatStyle}>
                    <ChatMessageList
                        userId={this.props.userId}
                        messages={this.props.messages}/>
                    <ChatInput
                        onSendMessage={this.props.onSendMessage}
                        onStartCall={this.props.onStartCall}/>
                </div>
                <VideoWindow
                    ref={c => this.videoWindow = c}
                    onStartMoveVideoWindow={this.startMoveVideoWindow}/>
                <MoveVideoOverlay
                    movingVideo={this.state.movingVideo}
                    onMoveVideo={this.moveVideoWindow}/>
            </div>
        );
    }
}

Chat.propTypes = {
    userId: React.PropTypes.string.isRequired,
    messages: React.PropTypes.array.isRequired
}

class VideoWindow extends React.Component {
    constructor() {
        super();
        this.state = {
            videoPlaying: false
        };
    }
    componentDidMount() {
        this.videoNode.addEventListener('playing', e => {
            this.setState({videoPlaying: true});
        })
    }

    render() {
        const style = {
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '125px',
            maxWidth: '50%',
            cursor: 'move',
            display: this.state.videoPlaying ? 'inline-block' : 'none',
            boxShadow: '0px 0px 15px rgba(50, 50, 50, 0.4)',
            border: '1px solid rgba(50, 50, 50, 0.5)',
            borderRadius: '3px'
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

class MoveVideoOverlay extends React.Component {
   render() {
      const style = {
            position: 'absolute',
            top: '0px',
            width: '100%',
            height: '100%',
            display: this.props.movingVideo ? 'block' : 'none',
      };

      return (
         <div style={style} onMouseMove={this.props.onMoveVideo}></div>
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
            padding: '5px'
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
            borderRadius: '12px',
            fontSize: '12px',
            margin: '4px',
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
            borderTop: '1px solid #e1e1e1',
            display: 'flex'
        }

        const formStyle = {
            display: 'flex',
            flex: '1'
        };

        const inputStyle = {
            flex: '1',
            outline: 'none',
            padding: '5px',
            border: 'none',
            borderLeft: '1px solid #e1e1e1',
            borderRight: '1px solid #e1e1e1'
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

export default Playground;
