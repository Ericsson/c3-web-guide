import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';
import SimpleButton from './SimpleButton.jsx';
import {defaultBorder, lightGreyColor} from '../constants.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime.js'

class Codearea extends React.Component {
   componentDidMount() {
      const editorNode = ReactDOM.findDOMNode(this.editor);
      const codeMirrorNode = editorNode.querySelector('.CodeMirror');

      editorNode.style.flex = '1';
      editorNode.style.flexBasis = '0px';
      editorNode.style.overflow = 'auto';
      editorNode.style.position = 'relative';

      codeMirrorNode.style.height = '100%';
      codeMirrorNode.style.position = 'absolute';
      codeMirrorNode.style.top = '0';
      codeMirrorNode.style.right = '0';
      codeMirrorNode.style.bottom = '0';
      codeMirrorNode.style.left = '0';
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
         background: lightGreyColor,
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
