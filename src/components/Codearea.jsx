import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';
import SimpleButton from './SimpleButton.jsx';
import {defaultBorder} from '../constants.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime.js'

class Codearea extends React.Component {
   componentDidMount() {
      let editorNode = ReactDOM.findDOMNode(this.editor);
      editorNode.style.flex = '1';
      editorNode.style.overflow = 'auto';
      editorNode.querySelector('.CodeMirror').style.height = '100%';
   }

   render() {
      const codemirrorOptions = {
         mode: 'javascript',
         lineNumbers: true,
         theme: 'material',
         indentUnit: 4,
         keyMap: 'sublime',
         lineWrapping: true,
         readOnly: this.props.readOnly ? 'nocursor': false
      };

      let wrapperStyle = {
         display: 'flex',
         flexDirection: 'column'
      };
      Object.assign(wrapperStyle, this.props.style);

      const bottomBoxStyle = {
         height: 36,
         background: '#f8f8f8',
         border: defaultBorder,
         display: this.props.readOnly ? 'none' : 'block'
      };

      const buttonStyle = {
         float: 'right',
         height: 'inherit',
         borderLeft: defaultBorder
      };

      return (
         <div style={wrapperStyle}>
            <Codemirror
               ref={c => this.editor = c}
               value={this.props.code}
               onChange={this.props.onUpdateCode}
               options={codemirrorOptions}/>
            <div style={bottomBoxStyle}>
               <SimpleButton
                  style={buttonStyle}
                  onClick={this.props.onRunCode}>
                  Run code
               </SimpleButton>
               <SimpleButton
                  style={buttonStyle}
                  onClick={this.props.onResetCode}>
                  Reset
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
