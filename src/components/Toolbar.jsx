import React, { useState } from 'react';
import { Button } from 'antd';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'antd/dist/antd.css';

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: props.editorState
        };
        this.onChange = editorState => this.setState({editorState});
    }

    _onBoldClick = () => {
        this.state = {
            editorState: RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Button type="default" size="middle" onClick={this._onBoldClick.bind(this)}>B</Button>
                </div>
                <div>

                </div>
            </div>
        );
    }
}

export default Toolbar;