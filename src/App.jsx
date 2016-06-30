import React from 'react';
import Playground from './components/Playground.jsx';
import Markdown from './components/Markdown.jsx';
import './base.css';

class App extends React.Component {
    render() {
        const playgroundStyle = {
            width: '50%',
            height: '100vh',
            float: 'left'
        };

        const markdownStyle = {
            float: 'right',
            width: '50%',
            maxHeight: '100vh',
            overflow: 'auto'
        };

        return (
            <div>
                <Playground style={playgroundStyle}/>
                <Markdown style={markdownStyle} src='guide.md'/>
            </div>
        );
    }
}

export default App;
