import React from 'react';

class Playground extends React.Component {
    render() {
        const chatStyle = {
            height: '200px',
            width: '50%'
        };

        return (
            <div>
                <Chat style={chatStyle} userId='user1'/>
                <Chat style={chatStyle} userId='user2'/>
            </div>
        );
    }
}

class Chat extends React.Component {
    constructor() {
        super();

        this.state = {
            messages: []
        }

        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(text) {
        if(!text) {
            return;
        }

        const message = {
            authorId: this.props.userId,
            text: text,
            messageId: Date.now()
        }

        const messages = this.state.messages.concat([message]);
        this.setState({messages});
    }

    render() {
        let wrapperStyle = {
            display: 'inline-block',
            width: '100%',
            height: '200px'
        };
        Object.assign(wrapperStyle, this.props.style);

        const chatStyle = {
            border: '1px solid #e1e1e1',
            display: 'flex',
            height: 'inherit',
            flexDirection: 'column'
        };

        return (
            <div style={wrapperStyle}>
                <div style={chatStyle}>
                    <ChatMessageList userId={this.props.userId} messages={this.state.messages}/>
                    <ChatInput onSendMessage={this.sendMessage}/>
                </div>
            </div>
        );
    }
}

Chat.propTypes = {
    userId: React.PropTypes.string.isRequired
}

class ChatMessageList extends React.Component {
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
            <div style={style}>
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

        this.state = {
            buttonActive: false,
            buttonHiver: false
        }

        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.buttonStartHover = this.buttonStartHover.bind(this);
        this.buttonStopHover = this.buttonStopHover.bind(this);
        this.buttonStartClick = this.buttonStartClick.bind(this);
        this.buttonStopClick = this.buttonStopClick.bind(this);
    }

    handleSendMessage(e) {
        e.preventDefault();
        this.props.onSendMessage(this.chatInput.value);
        this.chatInput.value = '';
    }

    buttonStartHover() {
        this.setState({buttonHover: true});
    }

    buttonStopHover() {
        this.setState({buttonHover: false});
    }

    buttonStartClick() {
        this.setState({buttonActive: true});
    }

    buttonStopClick() {
        this.setState({buttonActive: false});
    }

    render() {
        const wrapperStyle = {
            display: 'flex',
            borderTop: '1px solid #e1e1e1'
        };

        const inputStyle = {
            flex: '1',
            outline: 'none',
            padding: '5px',
            border: 'none',
            borderRight: '1px solid #e1e1e1'
        };

        const buttonStyle = {
            background: this.state.buttonActive ? '#e1e1e1' : this.state.buttonHover ? '#e6e6e6' : '#f0f0f0',
            border: 'none',
            outline: 'none',
            userSelect: 'none',
            color: '#222',
            cursor: 'pointer'
        };

        return (
            <form style={wrapperStyle} onSubmit={this.handleSendMessage}>
                <input
                    style={inputStyle}
                    ref={c => this.chatInput = c}
                    type='text'/>
                <button
                    style={buttonStyle}
                    type='submit'
                    onMouseEnter={this.buttonStartHover}
                    onMouseLeave={this.buttonStopHover}
                    onMouseDown={this.buttonStartClick}
                    onMouseUp={this.buttonStopClick}>
                    Send
                </button>
            </form>
        );
    }
}

export default Playground;
