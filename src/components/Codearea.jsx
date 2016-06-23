import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime.js'

class Codearea extends React.Component {
   constructor() {
      super();

      this.state = {
        consoleContent: '',
        errorContent: '',
        resizing: false
      };

      this.updateCode = this.updateCode.bind(this);
      this.runCode = this.runCode.bind(this);
      this.startResize = this.startResize.bind(this);
      this.resize = this.resize.bind(this);
   }

   componentDidMount() {
      this.editorNode = ReactDOM.findDOMNode(this.editor);
      this.bottomBoxNode = ReactDOM.findDOMNode(this.bottomBox);

      this.editorNode.style.width = this.props.console ? 'calc(50% - ' + this.props.resizeDividerWidth / 2 + 'px)' : '100%';
      this.bottomBoxNode.style.width = this.editorNode.style.width;

      this.editorNode.querySelector('.CodeMirror').style.height = 'calc(100% - ' + this.props.bottomBoxHeight + 'px)';
      this.bottomBoxNode.style.height = this.props.bottomBoxHeight + 'px';
   }

   updateCode(newCode) {
      this.setState({code: newCode});
      this.props.onChange(newCode);
   }

   runCode() {
      const code = this.state.code;
      const oldConsole = window.console;
      let consoleContent = '';
      let errorContent = '';

      function addToConsoleContent(args) {
         if(consoleContent) {
            consoleContent += '\n';
         }
         for(let i = 0; i < args.length; i++) {
            consoleContent += args[i] + ' ';
         }
      }

      function addToErrorContent(args) {
         if(errorContent) {
            errorContent += '\n';
         }
         for(let i = 0; i < args.length; i++) {
            errorContent += args[i] + ' ';
         }
      }

      window.console = {
         log: function() {
            addToConsoleContent(arguments);
         },
         error: function() {
            addToErrorContent(arguments);
         },
         dir: function() {
            addToConsoleContent(arguments);
         },
         warn: function() {
            addToConsoleContent(arguments);
         },
         info: function() {
            addToConsoleContent(arguments);
         },
         debug: function() {
            addToConsoleContent(arguments);
         }
      };

      try {
         eval(code);
      } catch(error) {
         console.error(error);
      }

      this.setState({consoleContent, errorContent});
      window.console = oldConsole;
      this.props.onSubmit(code);
   }

   startResize() {
      this.setState({resizing: true});
      const handleMouseUp = function() {
         window.removeEventListener('mouseup', handleMouseUp);
         this.setState({resizing: false});
      }.bind(this);
      window.addEventListener('mouseup', handleMouseUp);
   }

   resize(e) {
      const overlayRect = e.target.getBoundingClientRect();
      const offsetLeft = e.clientX - overlayRect.left;
      const newEditorWidth = e.clientX - overlayRect.left - this.props.resizeDividerWidth / 2;
      if(newEditorWidth >= this.props.componentMinWidth &&
         newEditorWidth <= overlayRect.width - this.props.componentMinWidth - this.props.resizeDividerWidth) {
         this.editorNode.style.width = newEditorWidth + 'px';
         this.bottomBoxNode.style.width = this.editorNode.style.width;
      }
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

      let style = {
         height: '300px',
         border: '1px solid #d9d9d9',
         position: 'relative',
         display: 'flex'
      };

      Object.assign(style, this.props.style);

      const bottomBoxStyle = {
         display: 'flex',
         position: 'absolute',
         left: '0px',
         bottom: '0px'
      };

      return (
         <div style={style}>
            <ResizeOverlay
               onResize={this.resize}
               visible={this.state.resizing}/>
            <Codemirror
               ref={(c) => this.editor = c}
               value={this.state.code}
               onChange={this.updateCode}
               options={codemirrorOptions}/>
            <div
               ref={(c) => this.bottomBox = c}
               style={bottomBoxStyle}>
               <ErrorBox content={this.state.errorContent}/>
               <RunCodeButton handleRunCode={this.runCode}/>
            </div>
            <ResizeDivider
               width={this.props.resizeDividerWidth}
               onResizeStart={this.startResize}
               visible={this.props.console}/>
            <Console
               visible={this.props.console}
               content={this.state.consoleContent}/>
         </div>
      );
   }
}

Codearea.defaultProps = {
   console: true,
   resizeDividerWidth: 5,
   componentMinWidth: 100,
   bottomBoxHeight: 38,
   onChange: () => {},
   onSubmit: () => {}
};

class RunCodeButton extends React.Component {
   constructor() {
      super();

      this.state = {
         hover: false,
         active: false
      };

      this.startHover = this.startHover.bind(this);
      this.stopHover = this.stopHover.bind(this);
      this.startClick = this.startClick.bind(this);
      this.stopClick = this.stopClick.bind(this);
   }

   startHover() {
      this.setState({hover: true});
   }

   stopHover() {
      this.setState({hover: false});
   }

   startClick() {
      this.setState({active: true});
   }

   stopClick() {
      this.setState({active: false});
   }

   render() {
      const style = {
         background: this.state.active ? '#e1e1e1' : this.state.hover ? '#e6e6e6' : '#f0f0f0',
         border: 'none',
         borderLeft: '1px solid #d9d9d9',
         outline: 'none',
         userSelect: 'none',
         color: '#222',
         cursor: 'pointer'
      };

      return (
         <button
            style={style}
            onClick={this.props.handleRunCode}
            onMouseEnter={this.startHover}
            onMouseLeave={this.stopHover}
            onMouseDown={this.startClick}
            onMouseUp={this.stopClick}>
            Run code
         </button>
      );
   }
}

class ErrorBox extends React.Component {
   render() {
      const style = {
         resize: 'none',
         outline: 'none',
         border: 'none',
         padding: '10px',
         fontSize: '14px',
         background: '#fafafa',
         color: '#b30000',
         flex: '1'
      };

      return (
         <textarea
            style={style}
            readOnly
            value={this.props.content}>
         </textarea>
      );
   }
}

class Console extends React.Component {
   render() {
      const style = {
         resize: 'none',
         outline: 'none',
         border: 'none',
         display: this.props.visible ? 'inline-block' : 'none',
         flex: '1',
         padding: '10px',
         fontSize: '14px',
         background: '#fafafa'
      };

      return (
         <textarea
            style={style}
            readOnly
            value={this.props.content}>
         </textarea>
      );
   }
}

class ResizeDivider extends React.Component {
   render() {
      const dividerStyle = {
         width: this.props.width + 'px',
         cursor: 'ew-resize',
         boxSizing: 'border-box',
         background: '#d0d0d0',
         display: this.props.visible ? 'flex' : 'none',
         justifyContent: 'center'
      };

      const grabberStyle = {
         background: '#888',
         width: Math.floor(this.props.width / 2) + 'px',
         height: '12px',
         borderRadius: this.props.width / 2 + 'px',
         alignSelf: 'center'
      };

      return (
         <div style={dividerStyle} onMouseDown={this.props.onResizeStart}>
            <div style={grabberStyle}></div>
         </div>
      );
   }
}

class ResizeOverlay extends React.Component {
   render() {
      const style = {
         width: '100%',
         height: '100%',
         display: (this.props.visible ? 'block' : 'none'),
         position: 'absolute',
         zIndex: '5',
         cursor: 'ew-resize'
      };

      return (
         <div style={style} onMouseMove={this.props.onResize}></div>
      );
   }
}

export default Codearea;
