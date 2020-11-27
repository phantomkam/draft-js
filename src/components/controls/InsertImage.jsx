import React from 'react';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import axios from 'axios';
import { ImageOutlined } from '@material-ui/icons';

class InsertImage extends React.Component {
    constructor(props) {
        super(props);

        this.uploadMedia = this.uploadMedia.bind(this);
        this.insertImage = this.insertImage.bind(this);
        
    }

    uploadMedia = (e) => {
        let file = e.target.files[0];
        // this.getBase64(file).then(base64 => {
        //     localStorage["fileBase64"] = base64;
        //     console.log(base64);
        // });
        let data = new FormData();
        data.append('file', file);
        data.append('name', file.name);

        axios.post('http://draftjs.server.me/upload.php', data, {
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response) {
                let imgUrl = response.data;
                if (imgUrl) {
                    this.props.handleEditorStateUpdate(this.insertImage(imgUrl));
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    insertImage = (url) => {
        const contentState = this.props.editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'image',
            'IMMUTABLE',
            { src: url },
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(this.props.editorState, { currentContent: contentStateWithEntity });
        return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    }


    render() {
        return (
            <>
                <label htmlFor="imgUpload" className="ant-btn ant-btn-default">
                    <ImageOutlined />
                </label>
                <input 
                    type="file" 
                    name="imgUpload" 
                    className="d-none" 
                    id="imgUpload" 
                    onChange={this.uploadMedia}
                    accept="image/x-png,image/gif,image/jpeg"
                />
            </>
        );
    }
}

export default InsertImage;