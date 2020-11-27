import React from 'react';
import InsertLink from './controls/InsertLink';
import InsertImage from './controls/InsertImage';
import InsertVideo from './controls/InsertVideo';


class MediaStyleControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showVideoModal: false,
        };
    }

    handleEditorStateUpdate = (newState) => {
        this.props.handleEditorStateUpdate(newState);
    }

    render() {
        return (
            <>
                <div className="RichEditor-controls">
                    <InsertLink 
                        editorState={this.props.editorState} 
                        handleEditorStateUpdate={this.handleEditorStateUpdate.bind(this)}
                    />
                    <InsertImage
                        editorState={this.props.editorState}
                        handleEditorStateUpdate={this.handleEditorStateUpdate.bind(this)}
                    />
                    <InsertVideo
                        editorState={this.props.editorState}
                        handleEditorStateUpdate={this.handleEditorStateUpdate.bind(this)}
                    />
                </div>
            </>
        );
    }
}

export default MediaStyleControls;