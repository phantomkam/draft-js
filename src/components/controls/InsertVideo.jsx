import React from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';
import { VideoLibrary, Backup } from '@material-ui/icons';

class InsertVideo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showVideoModal: false,
            isUploading: false,
        }

        this.openModal = this.openModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.uploadMedia = this.uploadMedia.bind(this);
        this.insertVideo = this.insertVideo.bind(this);
        
    }

    openModal = () => {
        this.setState({
            showVideoModal: true
        });
    }

    handleCancel = () => {
        this.setState({
            showVideoModal: false
        });
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
                let videoUrl = response.data;
                if (videoUrl) {
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    insertVideo = (url) => {
        console.log(url);
        // const contentState = this.props.editorState.getCurrentContent();
        // const contentStateWithEntity = contentState.createEntity(
        //     'image',
        //     'IMMUTABLE',
        //     { src: url },
        // );
        // const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        // const newEditorState = EditorState.set(this.props.editorState, { currentContent: contentStateWithEntity });
        // return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    }


    render() {
        return (
            <>
                <Button type="default" onClick={this.openModal}>
                    <VideoLibrary />
                </Button>
                <Modal
                    visible={this.state.showVideoModal}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    okButtonProps={{ disabled: !this.state.canConform }}
                    okText="Confirm"
                    width={600}
                    centered
                >
                    <div className={this.state.isUploading ? 'd-none' : ''}>
                        <div className="d-flex align-items-center justify-content-center">
                            <span style={{ marginTop: 50, padding: 30, backgroundColor: '#F6F6F6', borderRadius: '50%', }}>
                                <Backup style={{ fontSize: 70, fill: '#808080' }}/>
                            </span>
                        </div>
                        <label htmlFor="videoUpload" className="ant-btn ant-btn-default">
                            Upload Video
                        </label>
                        <input 
                            type="file" 
                            name="videoUpload" 
                            className="d-none" 
                            id="videoUpload" 
                            onChange={this.uploadMedia}
                            accept="video/*" 
                        />
                    </div>
                    <div className={this.state.isUploading ? '' : 'd-none'}>

                    </div>
                </Modal>
            </>
        );
    }
}

export default InsertVideo;