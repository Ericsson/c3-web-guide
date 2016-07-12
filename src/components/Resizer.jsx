import React from 'react';
import {defaultBorderColor} from '../constants.js';

class Resizer extends React.Component {
    constructor() {
        super();

        this.state = {
            directionColumn: false
        };

        this.resizeHandler = this.resizeHandler.bind(this);
    }

    componentDidMount() {
        this.prevNode = this.node.previousSibling;
        this.nextNode = this.node.nextSibling;
        this.parentNode = this.node.parentNode;

        const directionColumn = this.parentNode.style.flexDirection === 'column';
        this.setState({directionColumn});

        window.addEventListener('resize', this.resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler);
    }

    resizeHandler() {
        const prevNodeRect = this.prevNode.getBoundingClientRect();
        const nextNodeRect = this.nextNode.getBoundingClientRect();
        const prevNodeSize = this.state.directionColumn ? prevNodeRect.height : prevNodeRect.width;
        const nextNodeSize = this.state.directionColumn ? nextNodeRect.height : nextNodeRect.width;

        if(prevNodeSize < this.props.elementMinSize || nextNodeSize < this.props.elementMinSize) {
            this.prevNode.style.flex = '1';
        }
    }

    startResize() {
        const directionColumn = this.state.directionColumn;
        const size = this.props.size;
        const elementMinSize = this.props.elementMinSize;
        const defaultCursor = document.body.style.cursor;
        const prevNodeRect = this.prevNode.getBoundingClientRect();
        const parentNodeRect = this.parentNode.getBoundingClientRect();

        document.body.style.cursor = directionColumn ? 'ns-resize' : 'ew-resize';

        const handleMouseMove = e => {
            e.preventDefault();
            e.returnValue = false;
            window.getSelection().removeAllRanges();

            const parentNodeSize = directionColumn ? parentNodeRect.height : parentNodeRect.width;
            let newPrevNodeSize = (directionColumn ? e.clientY - prevNodeRect.top : e.clientX - prevNodeRect.left) - size / 2;
            const newNextNodeSize = parentNodeSize - size - newPrevNodeSize;

            if(newPrevNodeSize >= elementMinSize) {
                if(newNextNodeSize < elementMinSize) {
                    newPrevNodeSize = parentNodeSize - size - elementMinSize;
                }
            } else {
                newPrevNodeSize = elementMinSize;
            }

            this.prevNode.style.flex = `0 0 ${newPrevNodeSize}px`;
        }

        const handleMouseUp = () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.style.cursor = defaultCursor;
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    render() {
        const style = {
            minWidth: this.props.size,
            minHeight: this.props.size,
            background: defaultBorderColor,
            cursor: this.state.directionColumn ? 'ns-resize' : 'ew-resize'
        };

        return (
            <div
                onMouseDown={this.startResize.bind(this)}
                ref={c => {this.node = c}}
                style={style}/>
        );
    }
}

Resizer.defaultProps = {
    size: 5,
    elementMinSize: 100
}

export default Resizer;
