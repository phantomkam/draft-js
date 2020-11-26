import React from 'react';
import { EditorState, RichUtils, AtomicBlockUtils, Modifier, SelectionState } from 'draft-js';
import { Modal, Button, Input, Layout } from 'antd';
import axios from 'axios';
import { Popover } from '@material-ui/core';
import { Check, Edit, DeleteOutline } from '@material-ui/icons';
import { LinkOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Link, ImageOutlined } from '@material-ui/icons';

class MediaStyleControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            linkText: '',
            linkUrl: '',
            canConform: false,
            showLinkModal: false,
            showVideoModal: false,
        };

        this.showPopover = false;
        this.anChorEl = null;
        this.handleCancel = this.handleCancel.bind(this);
        this.linkTextChange = this.linkTextChange.bind(this);
        this.linkUrlChange = this.linkUrlChange.bind(this);
        this.promptForLink = this.promptForLink.bind(this);
        this.confirmLink = this.confirmLink.bind(this);
        this.uploadMedia = this.uploadMedia.bind(this);
        this.insertImage = this.insertImage.bind(this);
    }

    // URL Insert 

    promptForLink = (e) => {
        e.preventDefault();
        const editorState = this.props.editorState;
        const selectionState = editorState.getSelection();
        const anchorKey = selectionState.getAnchorKey();
        const currentContent = editorState.getCurrentContent();
        const currentContentBlock = currentContent.getBlockForKey(anchorKey);
        const start = selectionState.getStartOffset();
        const end = selectionState.getEndOffset();
        const selectedText = currentContentBlock.getText().slice(start, end);

        const startKey = selectionState.getStartKey();
        const blockWithLinkAtBeginning = currentContent.getBlockForKey(startKey);
        const linkKey = blockWithLinkAtBeginning.getEntityAt(start);

        let url = '';
        if (linkKey) {
            const linkInstance = currentContent.getEntity(linkKey);
            url = linkInstance.getData().url;
        }
        this.setState({
            linkText: selectedText,
            linkUrl: url,
            showLinkModal: true
        });
    }

    confirmLink = (e) => {
        e.preventDefault();
        const { linkUrl, linkText } = this.state;
        const editorState = this.props.editorState;
        const selectionState = editorState.getSelection();
        let contentState = editorState.getCurrentContent();
        contentState = Modifier.replaceText(contentState, editorState.getSelection(), linkText);
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'IMMUTABLE',
            {
                url: linkUrl,
            }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        var sState = SelectionState.createEmpty();
        var updateState = sState.merge({
            anchorKey: selectionState.anchorKey,
            anchorOffset: selectionState.getStartOffset(),
            focusKey: selectionState.focusKey,
            focusOffset: selectionState.getStartOffset() + linkText.length,
        });

        const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
        const arg = RichUtils.toggleLink(
            newEditorState,
            updateState,
            entityKey
        );

        this.props.handleEditorStateUpdate(arg);

        this.setState({
            linkUrl: '',
            showLinkModal: false
        });
    }

    showPopover = (anChorEl) => {
        this.showPopover = true;
        this.anChorEl = anChorEl;
    }

    closePopover = () => {
        this.showPopover = false;
        this.anChorEl = null;
    }

    handleCancel = e => {
        this.setState({
            showLinkModal: false,
            showVideoModal: false,
            linkText: '',
            linkUrl: ''
        });
    };

    linkTextChange = e => {
        const { linkText } = this.state;
        this.setState({
            linkText: e.target.value,
            canConform: e.target.value != linkText && e.target.value != '' ? true : false
        });
    }

    linkUrlChange = e => {
        const { linkUrl } = this.state;
        this.setState({
            linkUrl: e.target.value,
            canConform: e.target.value != linkUrl && e.target.value != '' ? true : false
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
        const { Sider , Content } = Layout;
        return (
            <>
                <div className="RichEditor-controls">
                    <Button type="default" onClick={this.promptForLink}>
                        <Link />
                    </Button>
                    <label htmlFor="imgUpload" className="ant-btn ant-btn-default">
                        <ImageOutlined />
                    </label>
                    <input type="file" name="imgUpload" className="d-none" id="imgUpload" onChange={this.uploadMedia} />
                </div>
                <Modal
                    title="Insert Link"
                    visible={this.state.showLinkModal}
                    onOk={this.confirmLink}
                    onCancel={this.handleCancel}
                    okButtonProps={{ disabled: !this.state.canConform }}
                    okText="Confirm"
                    width={400}
                    centered
                >
                    <Input value={this.state.linkText} onChange={this.linkTextChange} size="large" placeholder="Enter Link Text" prefix={<FontSizeOutlined className="" />} className="mb-2" />
                    <Input value={this.state.linkUrl} type="url" onChange={this.linkUrlChange} size="large" placeholder="Enter Link Address" prefix={<LinkOutlined className="" />} />
                </Modal>
                <Popover
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={this.showPopover}
                    anchorEl={this.anChorEl}
                >
                    <Layout>
                        <Sider style={{ backgroundColor: 'white', }}>
                            {this.state.linkUrl}
                        </Sider>
                        <Layout>
                            <Content style={{ backgroundColor: 'white', }}>
                                <Edit fontSize="small" /> <DeleteOutline fontSize="small" />
                            </Content>
                        </Layout>
                    </Layout>
                </Popover>
            </>
        );
    }
}

export default MediaStyleControls;