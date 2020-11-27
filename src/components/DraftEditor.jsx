import React, { createRef } from "react";
import {
  EditorState,
  Modifier,
  RichUtils,
} from "draft-js";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  FormatClear,
} from "@material-ui/icons";
import InlineStyleControls from "./InlineStyleControls";
import BlockStyleControls from "./BlockStyleControls";
import MediaStyleControls from "./MediaStyleControls";
import { Link, findLinkEntities } from "./controls/Link";
import Editor, { composeDecorators } from "draft-js-plugins-editor";
import createImagePlugin from "@draft-js-plugins/image";
import createFocusPlugin from "draft-js-focus-plugin";
import createResizeablePlugin from "@draft-js-plugins/resizeable";

import "draft-js/dist/Draft.css";
import "antd/dist/antd.css";
import "@draft-js-plugins/image/lib/plugin.css";
import "@draft-js-plugins/focus/lib/plugin.css";
import editorStyles from "./styles/editorStyles.css";

import { Button } from "antd";
import Media from "./Media";

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator,
);
const imagePlugin = createImagePlugin({ decorator });
const plugins = [imagePlugin, focusPlugin, resizeablePlugin];
const decorators = [
  {
    strategy: findLinkEntities,
    component: Link,
  },
];

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.editorRef = createRef();

    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return "handled";
    }

    return "not-handled";
  };

  _toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  _toggleInlineStyle = (inlineStyle) => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  };

  _onTab = (e) => {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  };

  _clear = () => {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const styles = editorState.getCurrentInlineStyle();

    const removeStyles = styles.reduce((state, style) => {
      return Modifier.removeInlineStyle(state, selection, style);
    }, contentState);

    const removeBlock = Modifier.setBlockType(
      removeStyles,
      selection,
      "unstyled"
    );

    this.setState({
      editorState: EditorState.push(editorState, removeBlock),
    });
  };

  getBlockStyle = (block) => {
    switch (block.getType()) {
      case "blockquote":
        return "RichEditor-blockquote";
      default:
        return null;
    }
  };

  mediaBlockRenderer = (block) => {
    if (block.getType() === "atomic") {
      return {
        component: Media,
        editable: false,
      };
    }
    return null;
  };

  handleEditorStateUpdate = (newState) => {
    this.setState({
      editorState: newState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    const inlineIcoins = [
      { label: "Bold", style: "BOLD", icon: <FormatBold /> },
      { label: "Italic", style: "ITALIC", icon: <FormatItalic /> },
      { label: "Underline", style: "UNDERLINE", icon: <FormatUnderlined /> },
    ];
    const orderIcons = [
      {
        label: "UL",
        style: "unordered-list-item",
        icon: <FormatListBulleted />,
      },
      { label: "OL", style: "ordered-list-item", icon: <FormatListNumbered /> },
    ];
    const quoteIcons = [
      { label: "Blockquote", style: "blockquote", icon: <FormatQuote /> },
      { label: "Code Block", style: "code-block", icon: <Code /> },
    ];

    return (
      <div>
        <h1 className="text-center mb-3">Draft Editor</h1>
        <div className="border p-3">
          <div className="toolbar ">
            <div className="clearfix">
              <div className="toolbar-group">
                <InlineStyleControls
                  editorState={this.state.editorState}
                  icons={inlineIcoins}
                  onToggle={this._toggleInlineStyle.bind(this)}
                />
              </div>
              <div className="toolbar-group">
                <BlockStyleControls
                  editorState={this.state.editorState}
                  icons={orderIcons}
                  onToggle={this._toggleBlockType.bind(this)}
                />
              </div>
              <div className="toolbar-group">
                <BlockStyleControls
                  editorState={this.state.editorState}
                  icons={quoteIcons}
                  onToggle={this._toggleBlockType.bind(this)}
                />
              </div>
              <div className="toolbar-group">
                <Button
                  type="default"
                  size="middle"
                  onClick={this._clear.bind(this)}
                >
                  <FormatClear />
                </Button>
              </div>
            </div>
            <div className="clearfix">
              <div className="toolbar-group">
                <MediaStyleControls
                  editorState={this.state.editorState}
                  handleEditorStateUpdate={this.handleEditorStateUpdate.bind(
                    this
                  )}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className={editorStyles.editor} onClick={this.focus}>
            <Editor
              blockRendererFn={this.mediaBlockRenderer}
              //   blockstylefn={this.getBlockStyle}
              editorState={this.state.editorState}
              onChange={this.onChange}
              handleKeyCommand={this.handleKeyCommand}
              plugins={plugins}
              decorators={decorators}
              ref={(element) => {
                this.editor = element;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DraftEditor;
