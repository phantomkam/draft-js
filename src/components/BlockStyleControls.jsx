import StyleButton from './StyleButton';

const BlockStyleControls = (props) => {
    const {editorState, icons} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    

    return (
        <div className="RichEditor-controls">
            {icons.map((icon) =>
                <StyleButton
                    key={icon.label}
                    active={icon.style === blockType}
                    label={icon.icon}
                    onToggle={props.onToggle}
                    style={icon.style}
                />
            )}
        </div>
    );
};

export default BlockStyleControls;