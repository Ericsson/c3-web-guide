import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';
import SimpleButton from './SimpleButton.jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime.js'

class Codearea extends React.Component {
   constructor() {
      super();

      this.state = {
        code: ''
      };

      this.updateCode = this.updateCode.bind(this);
      this.onRunCode = this.onRunCode.bind(this);
      this.clearCode = this.clearCode.bind(this);
   }

   componentDidMount() {
      let editorNode = ReactDOM.findDOMNode(this.editor);
      editorNode.style.flex = '1';
      editorNode.style.overflow = 'auto';
      editorNode.querySelector('.CodeMirror').style.height = '100%';
   }

   updateCode(newCode) {
      this.setState({code: newCode});
      this.props.onChange(newCode);
   }

   onRunCode() {
      this.props.onRunCode(this.state.code);
   }

   clearCode() {
      this.setState({code: ''});
   }

   render() {
      const codemirrorOptions = {
         mode: 'javascript',
         lineNumbers: true,
         theme: 'material',
         indentUnit: 4,
         keyMap: 'sublime',
         lineWrapping: true
      };

      let wrapperStyle = {
         display: 'flex',
         flexDirection: 'column'
      };
      Object.assign(wrapperStyle, this.props.style);

      const bottomBoxStyle = {
         height: '36px',
         background: '#f8f8f8',
         border: '1px solid #e1e1e1'
      };

      const buttonStyle = {
         float: 'right',
         height: 'inherit',
         borderLeft: '1px solid #e1e1e1'
      };

      return (
         <div style={wrapperStyle}>
            <Codemirror
               ref={(c) => this.editor = c}
               value={this.state.code}
               onChange={this.updateCode}
               options={codemirrorOptions}/>
            <div style={bottomBoxStyle}>
               <SimpleButton
                  style={buttonStyle}
                  onClick={this.onRunCode}>
                  Run code
               </SimpleButton>
               <SimpleButton
                  style={buttonStyle}
                  onClick={this.clearCode}>
                  Clear code
               </SimpleButton>
            </div>
         </div>
      );
   }
}

Codearea.defaultProps = {
   onChange: () => {},
   onSubmit: () => {}
};

export default Codearea;
