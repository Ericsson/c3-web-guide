import React from 'react';
import Codearea from './components/Codearea.jsx';
import Markdown from './components/Markdown.jsx';
import Playground from './components/Playground.jsx';

class App extends React.Component {
    render() {
        return (
            <div>
                <Codearea/>
                <Playground/>
            </div>
        );
    }
}

export default App;
